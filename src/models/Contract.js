const mongoose = require("mongoose");

const ContractSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["buy", "sell"],
      required: true,
    },

    postingDate: {
      type: String,
      default: new Date().toISOString(),
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    note:{
      type: String
    },

    price: {
      amount: { type: Number, required: true },
      unit: { type: String, required: true },
    },

    quantity: {
      amount: { type: Number, required: true },
      unit: { type: String, required: true },
    },

    product: {
      name: { type: String, required: true },
      variety: { type: String, required: true },
      location: { type: String, required: true },
      buyingFrequency: { type: String, default: "once" },
    },

    contractorInfo: {
      name: { type: String },
      state: { type: String },
      image: { type: String },
      phone: { type: String },
    },

    images: [{ type: [String] }],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Contract", ContractSchema);
  
