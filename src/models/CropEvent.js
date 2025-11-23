const mongoose = require("mongoose");

const cropEventSchema = new mongoose.Schema({
  plotId: { type: mongoose.Schema.Types.ObjectId, ref: "FarmerPlot" },
  title: String,
  type: String, // irrigation, pest, fertilizer, harvest
  dueDate: Date,
  isCompleted: { type: Boolean, default: false }
});

module.exports = mongoose.model("CropEvent", cropEventSchema);
