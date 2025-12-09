const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema({
  farmerName: String,
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: "Farmer" },
  ngoId: { type: mongoose.Schema.Types.ObjectId, ref: "Ngo" },
  amount: Number,
  purpose: String,
  status: {
    type: String,
    enum: ["pending", "approved", "declined"],
    default: "pending"
  }
}, { timestamps: true });

module.exports = mongoose.model("Loan", loanSchema);
