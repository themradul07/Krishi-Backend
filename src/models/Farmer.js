const mongoose = require('mongoose');

const FarmerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  crop: { type: String, default: '' },
  soilType: { type: String, default: '' },
  location: { type: String, default: '' },

  // GitHub version extra field
  irrigation: { type: String, default: '' }

}, { timestamps: true });

module.exports = mongoose.model('Farmer', FarmerSchema);
