const AgriService = require("../models/agriService.model");

// Haversine Distance Formula
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    0.5 - Math.cos(dLat) / 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    (1 - Math.cos(dLon)) / 2;

  return R * 2 * Math.asin(Math.sqrt(a));
}

exports.getNearbyServices = async (req, res) => {
  try {
    const { lat, lng, category } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ msg: "lat & lng required" });
    }

    let filter = {};
    if (category && category !== "all") {
      filter.category = category;
    }

    let services = await AgriService.find(filter);

    const result = services
      .map((s) => ({
        ...s._doc,
        distance: getDistance(lat, lng, s.lat, s.lng),
      }))
      .sort((a, b) => a.distance - b.distance);

    res.json(result);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
