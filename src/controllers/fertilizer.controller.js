const Fertilizer = require("../models/fertilizer.model");

// ADD NEW ENTRY
const addFertilizer = async (req, res) => {
  try {
    const fertilizer = new Fertilizer(req.body);
    await fertilizer.save();
    res.status(201).json({ message: "Added Successfully", data: fertilizer });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// SEARCH / FILTER
const searchFertilizer = async (req, res) => {
  try {
    const { crop, query, category } = req.body;

    let filter = {};

    if (crop && crop !== "all") filter.crop = crop;
    if (category && category !== "all") filter.category = category;

    if (query) {
      filter.$or = [
        { npk: { $regex: query, $options: "i" } },
        { weather: { $regex: query, $options: "i" } },
        { key: { $regex: query, $options: "i" } },
        { crop: { $regex: query, $options: "i" } }
      ];
    }

    const results = await Fertilizer.find(filter);
    res.json(results);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL
const getAllFertilizers = async (req, res) => {
  try {
    const all = await Fertilizer.find();
    res.json(all);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addFertilizer,
  searchFertilizer,
  getAllFertilizers
};
