const mongoose = require("mongoose");

const schemeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  crops: {
    type: [String], // array of crops
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("Scheme", schemeSchema);
