const Contract = require("../models/Contract");

// ===================== CREATE =====================
const createRequirement = async (req, res) => {
  try {
    console.log(req.body);
    const requirement = await Contract.create(req.body);

    res.status(201).json({
      success: true,
      message: "Requirement created successfully",
      data: requirement,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ===================== GET ALL WITH ADVANCED FILTERING =====================
const getRequirements = async (req, res) => {
  try {
    const {
      type,
      product,
      variety,
      location,
      buyingFrequency,
      minPrice,
      maxPrice,
      sortBy,     // price/date
      sortOrder,  // asc / desc
      page = 1,
      limit = 10,
    } = req.query;

    let filter = {};

    // --- BASIC FILTERS ---
    if (type) filter.type = type;

    if (product) filter["product.name"] = { $regex: product, $options: "i" };

    if (variety) filter["product.variety"] = { $regex: variety, $options: "i" };

    if (location) filter["product.location"] = { $regex: location, $options: "i" };

    if (buyingFrequency)
      filter["product.buyingFrequency"] = buyingFrequency;

    // --- PRICE RANGE ---
    if (minPrice || maxPrice) {
      filter["price.amount"] = {};
      if (minPrice) filter["price.amount"].$gte = Number(minPrice);
      if (maxPrice) filter["price.amount"].$lte = Number(maxPrice);
    }

    // --- SORTING ---
    let sortOptions = {};

    if (sortBy === "price") {
      sortOptions["price.amount"] = sortOrder === "asc" ? 1 : -1;
    } else if (sortBy === "date") {
      sortOptions["createdAt"] = sortOrder === "asc" ? 1 : -1;
    } else {
      sortOptions["createdAt"] = -1; // default newest first
    }

    // --- PAGINATION ---
    const skip = (Number(page) - 1) * Number(limit);

    const requirements = await Contract.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));
      

    const total = await Contract.countDocuments(filter);

    res.status(200).json({
      success: true,
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
      data: requirements,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ===================== GET ONE =====================
const getRequirementById = async (req, res) => {
  try {
    const requirement = await Contract.findById(req.params.id);

    if (!requirement)
      return res.status(404).json({ success: false, message: "Not found" });

    res.status(200).json({ success: true, data: requirement });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ===================== UPDATE =====================
const updateRequirement = async (req, res) => {
  try {
    const updated = await Contract.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated)
      return res.status(404).json({ success: false, message: "Not found" });

    res.status(200).json({
      success: true,
      message: "Updated successfully",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ===================== DELETE =====================
const deleteRequirement = async (req, res) => {
  try {
    const deleted = await Contract.findByIdAndDelete(
      req.params.id
    );

    if (!deleted)
      return res.status(404).json({ success: false, message: "Not found" });

    res.status(200).json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


module.exports = { createRequirement ,getRequirements, getRequirementById , updateRequirement , deleteRequirement}