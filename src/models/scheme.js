const mongoose =require("mongoose");

const schemeSchema = new mongoose.Schema({
  name: String,
  description: String,
  department: String,
  benefits: String,
  eligibility: {
    state: String,
    district: [String],
    minLand: Number,
    maxLand: Number,
    crops: [String],
    irrigationRequired: Boolean,
    incomeLimit: Number,
    maxAge : Number,
    caste: [String],
  },
  documents: [String],
  deadline: Date,
  link: String
});

module.exports = mongoose.model("Scheme", schemeSchema);