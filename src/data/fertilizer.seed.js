const mongoose = require("mongoose");
const Fertilizer = require("../models/fertilizer.model");

mongoose.connect("mongodb://127.0.0.1:27017/krishi")
  .then(() => console.log("DB connected"))
  .catch(err => console.log(err));

async function seedData() {
  const data = [
    {
      crop: "Paddy",
      category: "cereal",
      npk: "Basal: 40-20-20, Tillering: +20N, PI: +20N +10K",
      weather: "Avoid applying urea before rain",
      key: "Split application improves yield"
    },
    {
      crop: "Banana",
      category: "plantation",
      npk: "50-30-50 per plant annually",
      weather: "High rainfall decreases nutrient efficiency",
      key: "Apply in 3 splits"
    },
    {
      crop: "Coconut",
      category: "plantation",
      npk: "600g N, 300g P, 600g K per palm yearly",
      weather: "Avoid fertilization during waterlogging",
      key: "Apply with FYM for better uptake"
    }
  ];

  await Fertilizer.insertMany(data);
  console.log("Seed Data Inserted");
  process.exit();
}

seedData();
