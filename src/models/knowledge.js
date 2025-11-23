const mongoose = require("mongoose");

const knowledgeSchema = new mongoose.Schema({
  crop: { type: String, required: true },
  season: { type: String },
  state: { type: String },
  stage: { type: String, required: true },

  question: { type: String, required: true },
  answer: { type: String, required: true },

  tags: { type: [String], default: [] },
});

module.exports = mongoose.model("Knowledge", knowledgeSchema);
