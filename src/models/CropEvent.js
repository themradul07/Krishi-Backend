const mongoose = require("mongoose");

const cropEventSchema = new mongoose.Schema({
  plotId: { type: mongoose.Schema.Types.ObjectId, ref: "FarmerPlot" },
  title: String,
  type: String, 
  dueDate: Date,
  advice: String,
  isCompleted: { type: Boolean, default: false }
});

module.exports = mongoose.model("CropEvent", cropEventSchema);
