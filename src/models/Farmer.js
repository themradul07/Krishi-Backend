
// models/Farmer.js
const mongoose = require("mongoose");

const farmerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: '' },
  soilType: { type: String, default: '' },
  location: { type: String, default: '' },
  language: { type: String, default: "ml-IN" },
  irrigation : {type: String,  default: ""},
  primaryCrop: {type: String, default : " "},
  landSize: {type: String , default: ""},
  plot: { type: mongoose.Schema.Types.ObjectId, ref: "FarmerPlot" }
});

module.exports = mongoose.model("Farmer", farmerSchema);

