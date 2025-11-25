const Farmer = require('../models/Farmer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendWhatsApp } = require("../services/whatsapp.service");
const { sign } = require('../services/jwt.service');
const { OAuth2Client } = require("google-auth-library");
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);



const register = async (req, res) => {
  try {
    console.log(req.body);
    const { name, password, phone } = req.body;

    // Validate required fields
    if (!name || !password || !phone) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    // Check if email already exists
    const existing = await Farmer.findOne({ phone });
    if (existing) {
      return res.status(400).json({ message: 'Phone already registered' });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpires = Date.now() + 5 * 60 * 1000;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    // Create user with OTP fields
    const farmer = await Farmer.create({
      name,
      password: hashed,
      phone,
      otp,
      otpExpires
    });

    // Send OTP via WhatsApp (or SMS etc.)
    await sendWhatsApp(phone, `Your OTP is ${otp}`);

    // Create JWT
    const token = jwt.sign(
      { id: farmer._id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      message: 'Registered successfully! OTP sent.',
      token,
      farmerId: farmer._id
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const farmer = await Farmer.findOne({ email });
    if (!farmer) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, farmer.password);
    if (!match) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: farmer._id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    // --- WhatsApp ALERT ---
    // const whatsappMsg = `Dear ${farmer.name}, you have successfully logged in to Krishi Sakhi.`;
    // const phone = "+919140395305"; // you can change dynamically later
    // await sendWhatsApp(whatsappMsg, phone);

    return res.json({
      success: true,
      message: 'Logged in successfully!',
      token,
      farmerId: farmer._id
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpires = Date.now() + 5 * 60 * 1000;

    let farmer = await Farmer.findOne({ phone });
    if (!farmer) farmer = await Farmer.create({ phone });

    farmer.otp = otp;
    farmer.otpExpires = otpExpires;
    await farmer.save();
    await sendWhatsApp(phone, `Your OTP is ${otp}`);
    return res.json({ success: true, message: "OTP sent" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ success: false, message: e.message });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const farmer = await Farmer.findOne({ phone });
    if (!farmer) return res.status(400).json({ message: "User not found" });

    if (farmer.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    if (farmer.otpExpires < Date.now())
      return res.status(400).json({ message: "OTP expired" });

    // Clear OTP
    farmer.otp = null;
    farmer.otpExpires = null;
    await farmer.save();

    // Create JWT
    const token = jwt.sign(
      { userId: farmer._id, phone: farmer.phone },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ success: true, token });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ message: "idToken required" });

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const googleId = payload.sub;
    const email = payload.email;
    const name = payload.name;

    // find user by googleId OR email OR firebaseUid
    let farmer = await Farmer.findOne({ $or: [{ googleId }, { email }] });

    if (!farmer) {
      farmer = await Farmer.create({ name, email });
    } else {
      // ensure googleId/email stored
      farmer.email = farmer.email || email;
      farmer.name = farmer.name || name;
      await farmer.save();
    }
    const token = jwt.sign(
      { id: farmer._id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );
    res.json({ success: true, token, farmer });
  } catch (err) {
    console.error("googleLogin err:", err);
    res.status(401).json({ message: "Google verification failed", error: err.message });
  }
};

module.exports = { register, login, sendOtp, verifyOtp, googleLogin };
