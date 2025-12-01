const Scheme = require("../models/scheme");

// Build dynamic filters
const buildFilters = (query) => {
  let filters = {};

  if (query.state) {
    filters["eligibility.state"] = query.state;
  }

  if (query.district) {
    filters["eligibility.district"] = query.district;
  }

  if (query.crop) {
    filters["eligibility.crops"] = query.crop;
  }

  if (query.minLand) {
    filters["eligibility.minLand"] = { $lte: Number(query.minLand) };
  }

  if (query.maxLand) {
    filters["eligibility.maxLand"] = { $gte: Number(query.maxLand) };
  }

  if (query.incomeLimit) {
    filters["eligibility.incomeLimit"] = { $gte: Number(query.incomeLimit) };
  }

  if (query.department) {
    filters.department = query.department;
  }

  // Search by name / description text
  if (query.search) {
    filters.$or = [
      { name: { $regex: query.search, $options: "i" } },
      { description: { $regex: query.search, $options: "i" } },
    ];
  }

  return filters;
};

// GET Schemes with Pagination + Filters
const getSchemes = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filters = buildFilters(req.query);

    const sort = req.query.sort || "-deadline"; // latest first

    const schemes = await Scheme.find(filters)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Scheme.countDocuments(filters);

    res.json({
      success: true,
      page,
      totalPages: Math.ceil(total / limit),
      totalResults: total,
      results: schemes,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// CREATE Scheme
const createScheme = async (req, res) => {
  try {
    const scheme = await Scheme.create(req.body);
    res.json({ success: true, scheme });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// GET Single Scheme
const getSchemeById = async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id);
    if (!scheme) {
      return res.status(404).json({ success: false, message: "Scheme not found" });
    }
    res.json({ success: true, scheme });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// UPDATE Scheme
const updateScheme = async (req, res) => {
  try {
    const scheme = await Scheme.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!scheme) {
      return res.status(404).json({ success: false, message: "Scheme not found" });
    }

    res.json({ success: true, scheme });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// DELETE Scheme
const deleteScheme = async (req, res) => {
  console.log("Delete scheme called");
  console.log("Delete scheme called with id:", req.params.id);
  try {
    const scheme = await Scheme.findByIdAndDelete(req.params.id);

    if (!scheme) {
      return res.status(404).json({ success: false, message: "Scheme not found" });
    }

    res.json({ success: true, message: "Scheme deleted successfully" });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

module.exports = {  getSchemes, createScheme, getSchemeById, updateScheme, deleteScheme };
