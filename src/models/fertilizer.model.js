const mongoose = require("mongoose");

const fertilizerSchema = new mongoose.Schema({
  crop: { type: String, required: true },
  category: { type: String, default: "General" },
  npk: { type: String, required: true },
  weather: { type: String, required: true },
  key: { type: String, required: true }
});

module.exports = mongoose.model("Fertilizer", fertilizerSchema);
