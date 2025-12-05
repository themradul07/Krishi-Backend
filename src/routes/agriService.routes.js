const express = require("express");
const AgriService = require("../models/agriService.model.js");
const router = express.Router();

// Calculate distance between 2 GPS points (Haversine Formula)
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// GET Nearby Agri Services  
router.get("/", async (req, res) => {
  try {
    const { lat, lng, category } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: "Location missing" });
    }

    let filter = {};
    if (category && category !== "all") filter.category = category;

    // Fetch all items from DB
    let items = await AgriService.find(filter);

    // Add distance field
    items = items.map((s) => ({
      ...s._doc,
      distance: getDistance(lat, lng, s.lat, s.lng),
    }));

    // Sort by nearest
    items.sort((a, b) => a.distance - b.distance);

    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
