const mongoose = require("mongoose");
const Pesticide = require("../models/pesticide.model");


// 1️⃣ Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/krishi", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log("DB connection error:", err));


// 2️⃣ Sample data
const pesticides = [
  {
    name: "Imidacloprid",
    status: "Restricted",
    alternatives: ["Neem Oil", "Beauveria bassiana"]
  },
  {
    name: "Glyphosate",
    status: "Banned",
    alternatives: ["Manual weeding", "Mulching"]
  }
];


// 3️⃣ Seed function
async function seed() {
  try {
    await Pesticide.deleteMany();
    await Pesticide.insertMany(pesticides);
    console.log("Pesticide seed added");
  } catch (err) {
    console.log("Seed error:", err);
  } finally {
    mongoose.connection.close();
  }
}

seed();
