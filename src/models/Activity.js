const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },

  // GitHub version is primary
  type: { type: String, required: true },
  note: { type: String },

  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Activity', ActivitySchema);
