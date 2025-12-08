// routes/pesticides.js
const express = require("express");
const router = express.Router();
const Pesticide = require("../models/pesticide.model");

// GET all pesticides
router.get("/", async (req, res) => {
  try {
    const pesticides = await Pesticide.find();
    res.json(pesticides);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET pesticide by name
router.get("/:name", async (req, res) => {
  const name = req.params.name.toLowerCase();

  const pesticide = await Pesticide.findOne({
    name: { $regex: new RegExp("^" + name + "$", "i") }
  });

  if (!pesticide) {
    return res.status(404).json({ message: "Pesticide not found" });
  }

  res.json({
    name: pesticide.name,
    status: pesticide.status,
    alternatives: pesticide.alternatives || []
  });
});

module.exports = router;
