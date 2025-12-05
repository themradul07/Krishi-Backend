exports.predictSoil = (req, res) => {
  const input = req.body;

  // Dummy prediction logic — you can replace with ML later
  res.json({
    prediction: "Healthy Soil",
    confidence: 0.91,
    symptoms: ["Balanced nutrients", "Optimal moisture"],
    recommended_actions: ["Maintain current fertilizer schedule"],
    input,
  });
};
