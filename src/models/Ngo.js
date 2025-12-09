// models/Ngo.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const ngoSchema = new mongoose.Schema(
  {
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: "Farmer" },
    name: { type: String},
    email: { type: String },
    phone: { type: String },
    address: { type: String },
    description: { type: String },

    // Loan policy fields
    loanCriteria: { type: String },
    interestRate: { type: Number }, // in %
    maxLoan: { type: Number }, // in INR
    processingTime: { type: Number }, // in days


  },
  { timestamps: true }
);


module.exports = mongoose.model("Ngo", ngoSchema);
