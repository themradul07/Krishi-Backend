const mongoose = require("mongoose");

const marketPriceSchema = new mongoose.Schema({
  crop: {
    type: String,
    required: true,
  },
  market: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now, // auto timestamp
  },
});

module.exports = mongoose.model("MarketPrice", marketPriceSchema);
