import mongoose from "mongoose";

const BuyerSellerRequirementSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["buy", "sell"],  // NEW FIELD
      required: true,
    },

    postingDate: {
      type: String, // Example: "28 November 25"
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      amount: { type: Number, required: true },
      unit: { type: String, required: true }, // Kg, Quintal, Ton etc.
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

    buyer: {
      name: { type: String },
      state: { type: String },
      image: { type: String },
      phone: { type: String },
    },

    seller: {
      name: { type: String },
      state: { type: String },
      image: { type: String },
      phone: { type: String },
    },

    images: [
      {
        type: String, // URLs of product images
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.BuyerSellerRequirement ||
  mongoose.model("BuyerSellerRequirement", BuyerSellerRequirementSchema);
