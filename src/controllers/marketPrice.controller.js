const MarketPrice = require("../models/marketPrice");

exports.addMarketPrice = async (req, res) => {
  try {
    const data = await MarketPrice.create(req.body);
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.getAllMarketPrices = async (req, res) => {
  try {
    const data = await MarketPrice.find().sort({ date: -1 });
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.updateMarketPrice = async (req, res) => {
  try {
    const data = await MarketPrice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.deleteMarketPrice = async (req, res) => {
  try {
    await MarketPrice.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};
