const mongoose = require("mongoose");

const AgriServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ["shop", "lab", "tractor"], required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  address: { type: String },
  district: { type: String }
});

module.exports = mongoose.model("AgriService", AgriServiceSchema);
