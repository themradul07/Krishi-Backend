const mongoose = require("mongoose");
const CropTemplate = require("./src/models/CropTemplate");
const fs = require("fs");

async function seed() {
  await mongoose.connect("mongodb://localhost:27017/Krishi");

  const data = JSON.parse(fs.readFileSync("crop_templates.json", "utf8"));

  await CropTemplate.deleteMany({});
  await CropTemplate.insertMany(data);

  console.log("Crop templates seeded!");
  process.exit();
}

seed();
