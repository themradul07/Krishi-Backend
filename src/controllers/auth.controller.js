const Farmer = require('../models/Farmer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendWhatsApp } = require("../services/whatsapp.service");
const { OAuth2Client } = require("google-auth-library");
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const Admin = require("../models/Admin");



const register = async (req, res) => {
  try {
    console.log(req.body);
    const { name, password, phone } = req.body;

    // Validate required fields
    if (!name || !password || !phone) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    // Check if phone already exists
    const existing = await Farmer.findOne({ phone });
    if (existing) {
      return res.status(400).json({ message: 'Phone already registered' });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    // Create user with OTP fields
    const farmer = await Farmer.create({
      name,
      password: hashed,
      phone,
      otp,
      
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
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { phone, password, isAdmin } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    let user;

    // ----------------------------
    // 🔐 ADMIN LOGIN
    // ----------------------------
    if (isAdmin) {
      user = await Admin.findOne({ phone });

      if (!user) {
        return res.status(400).json({ success: false, message: "Admin not found" });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(400).json({ success: false, message: "Invalid admin credentials" });
      }

      const token = jwt.sign(
        { id: user._id, role: "admin" },
        process.env.JWT_SECRET || "secret",
        { expiresIn: "7d" }
      );

      // WhatsApp login alert
      try {
        await sendWhatsApp(phone, `Admin Login Alert: Hello ${user.name}, you have logged in successfully.`);
      } catch (err) {
        console.log("WhatsApp send error:", err.message);
      }

      return res.json({
        success: true,
        message: "Admin logged in successfully",
        token,
        adminId: user._id,
        role: "admin"
      });
    }

    // ----------------------------
    // 👨‍🌾 FARMER LOGIN
    // ----------------------------
    user = await Farmer.findOne({ phone });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: "farmer" },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    // WhatsApp login alert
    try {
      await sendWhatsApp(phone, `Dear ${user.name}, you have successfully logged in to Krishi Sakhi.`);
    } catch (err) {
      console.log("WhatsApp send error:", err.message);
    }

    return res.json({
      success: true,
      message: "Logged in successfully!",
      token,
      farmerId: user._id,
      role: "farmer"
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { login };


const resendOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000);
  

    let farmer = await Farmer.findOne({ phone });
    if (!farmer) farmer = await Farmer.create({ phone });

    farmer.otp = otp;
   
    await farmer.save();
    await sendWhatsApp(phone, `Your OTP is ${otp}`);
    return res.json({ success: true, message: "OTP resend successfully" });
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

    // Clear OTP
    farmer.otp = null;
   
    await farmer.save();

    // Create JWT
    const token = jwt.sign(
      { id: farmer._id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
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
    const name = payload.name;
    const email = payload.email;
    console.log("Google Login Payload:", payload);

    // find user by googleId OR phone OR firebaseUid
    let farmer = await Farmer.findOne( { email });
    if (!email) {
      throw new Error("Email is required for user creation.");
    }


    if (!farmer) {
      farmer = await Farmer.create({ name, email });
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

module.exports = { register, login, resendOtp, verifyOtp, googleLogin };
