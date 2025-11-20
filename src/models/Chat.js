const mongoose = require('mongoose');
const ChatSchema = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
  question: { type: String },
  answer: { type: String },
  timestamp: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Chat', ChatSchema);
