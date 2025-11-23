// models/CropTemplate.js
const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  name: String,            // "Land prep", "Sowing", "Fertilizer"
  relativeDay: Number,     // days from sowing/planting (use negative for pre-sowing events)
  windowDays: Number,      // acceptable window e.g., 7 days
  notes: { ml: String, en: String } // localized guidance
});

const CropTemplateSchema = new mongoose.Schema({
  crop: String,            // "paddy", "brinjal", ...
  variety: String,         // optional
  cycleDays: Number,       // expected days to harvest
  activities: [ActivitySchema]
});

module.exports = mongoose.model('CropTemplate', CropTemplateSchema);
