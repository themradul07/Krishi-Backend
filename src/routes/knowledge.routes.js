const express = require("express");
const router = express.Router();
const Knowledge = require("../models/knowledge");

// Add knowledge entry
router.post("/add", async (req, res) => {
  try {
    const data = await Knowledge.create(req.body);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get advice by crop + stage
router.post("/search", async (req, res) => {
  try {
    const { query, crop } = req.body;

    let filter = {};

    // crop filter
    if (crop && crop !== "all") {
      filter.crop = crop;
    }

    // keyword search
    if (query) {
      filter.$or = [
        { question: { $regex: query, $options: "i" } },
        { answer: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } }
      ];
    }

    const results = await Knowledge.find(filter);

    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


module.exports = router;
