// models/FarmerCrop.js
const mongoose = require("mongoose");

const farmerPlotSchema = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: "Farmer" },
  farmName : String,
  cropName: String,
  variety: String,
  sowingDate: Date,
  calendar: [{ type: mongoose.Schema.Types.ObjectId, ref: "CropEvent" }],
    
  
});

module.exports = mongoose.model("FarmerPlot", farmerPlotSchema);
