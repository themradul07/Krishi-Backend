
// models/Farmer.js
const mongoose = require("mongoose");

const farmerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  password: { type: String },
  phone: String,
  otp: String,
  soilType: { type: String, default: '' },
  location: {
    latitude: { type: String, default: "" },
    longitude: { type: String, default: "" },
    district: { type: String, default: "" },
  },
  language: { type: String, default: "ml" },
  irrigation: { type: String, default: "" },
  primaryCrop: { type: String, default: " " },
  landSize: { type: String, default: "" },
  plot: { type: mongoose.Schema.Types.ObjectId, ref: "FarmerPlot" },
  // isbuyer: { type: Boolean, default: false },
  role: { type: String, required: true }, // 'farmer', 'buyer', 'loan'
});

module.exports = mongoose.model("Farmer", farmerSchema);

