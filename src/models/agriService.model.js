const mongoose = require("mongoose");

const agriServiceSchema = new mongoose.Schema({
  name: String,
  category: String,
  address: String,
  lat: Number,
  lng: Number,
});

module.exports = mongoose.model("AgriService", agriServiceSchema);
