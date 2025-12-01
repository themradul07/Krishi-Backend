// models/Admin.js
const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  password: { type: String },
  phone: String,
  otp: String,
  soilType: { type: String, default: '' },
  language: { type: String, default: "ml" }
});

module.exports = mongoose.model("Admin", AdminSchema);
