const mongoose = require("mongoose");

const pesticideSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  status: {
    type: String,
    enum: ["Allowed", "Restricted", "Banned"],
    required: true
  },
  alternatives: {
    type: [String],
    default: []
  }
});

module.exports = mongoose.model("Pesticide", pesticideSchema);
