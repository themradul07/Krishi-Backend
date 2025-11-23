const Farmer = require('../models/Farmer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
<<<<<<< HEAD
=======
const { sendWhatsApp } = require("../services/whatsapp.service");
>>>>>>> 373506706092d837eface72795e891d054b53edd

const register = async (req, res) => {
  try {
    console.log(req.body);
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
    const existing = await Farmer.findOne({ email });
    if (existing) return res.status(400).json({ message: 'email already registered' });
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const farmer = await Farmer.create({ name, email, password: hashed });
    const token = jwt.sign({ id: farmer._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
<<<<<<< HEAD
    return res.json({success: true, message: 'Registered successfully!', token, farmerId: farmer._id});
=======
    return res.json({ success: true, message: 'Registered successfully!', token, farmerId: farmer._id });
>>>>>>> 373506706092d837eface72795e891d054b53edd
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });
    const farmer = await Farmer.findOne({ email });
    if (!farmer) return res.status(400).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, farmer.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: farmer._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
<<<<<<< HEAD
    return res.json({success: true, message: 'Logged in successfully!', token, farmerId: farmer._id});
=======
    // src/controllers/alert.controller.js

   
        const phone = "+919140395305"; // Farmer's WhatsApp number

        await sendWhatsApp(
          body = `Dear ${farmer.name}, you have successfully logged in to Krishi Sakhi.`,
          phone
        );

 

    return res.json({ success: true, message: 'Logged in successfully!', token, farmerId: farmer._id });
>>>>>>> 373506706092d837eface72795e891d054b53edd

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { register, login };
