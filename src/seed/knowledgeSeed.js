require("dotenv").config();
const mongoose = require("mongoose");
const Knowledge = require("../models/knowledge");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/krishi";

const entries = [
  // --- PADDY (Rice) ---
  {
    crop: "Paddy",
    season: "Kharif",
    state: "Kerala",
    stage: "Land preparation",
    question: "What is the ideal time to start ploughing for paddy in Kerala?",
    answer:
      "For Kharif paddy in Kerala, land preparation usually starts in May–June, before the onset of the monsoon. Fields should be ploughed 2–3 times and puddled properly.",
    tags: ["paddy", "kharif", "land preparation", "kerala"],
  },
  {
    crop: "Paddy",
    season: "Kharif",
    state: "Kerala",
    stage: "Sowing",
    question: "When should paddy seeds be sown in Kerala for Kharif season?",
    answer:
      "For Kharif season, paddy sowing in Kerala is usually done from June to July depending on rainfall and local conditions.",
    tags: ["paddy", "sowing time", "kharif"],
  },
  {
    crop: "Paddy",
    season: "Kharif",
    state: "Kerala",
    stage: "Fertilizer",
    question: "What is the recommended fertilizer dose for paddy in Kerala?",
    answer:
      "A general recommendation is 90:45:45 kg NPK per hectare, applied in split doses: 50% nitrogen as basal, 25% at tillering and 25% at panicle initiation, along with full P and K as basal.",
    tags: ["paddy", "fertilizer", "NPK", "dose"],
  },
  {
    crop: "Paddy",
    season: "Kharif",
    state: "Kerala",
    stage: "Irrigation",
    question: "How should irrigation be managed in transplanted paddy fields?",
    answer:
      "Maintain 2–5 cm of standing water after establishment, reduce water depth at tillering, and drain excess water before harvesting to avoid lodging.",
    tags: ["paddy", "irrigation", "water management"],
  },
  {
    crop: "Paddy",
    season: "Kharif",
    state: "Kerala",
    stage: "Pest management",
    question: "How to manage stem borer in paddy?",
    answer:
      "Use light traps, remove and destroy dead hearts, and if infestation is high, apply recommended insecticides like Chlorantraniliprole as per local agri department guidelines.",
    tags: ["paddy", "stem borer", "pest management"],
  },

  // --- BANANA ---
  {
    crop: "Banana",
    season: "Year-round",
    state: "Kerala",
    stage: "Planting",
    question: "What is the best time to plant banana in Kerala?",
    answer:
      "Banana can be planted almost year-round in Kerala, but September–November and February–March are preferred for good growth and yield.",
    tags: ["banana", "planting time"],
  },
  {
    crop: "Banana",
    season: "Year-round",
    state: "Kerala",
    stage: "Spacing",
    question: "What spacing should be used for banana planting?",
    answer:
      "Common spacing is 1.8 m × 1.8 m or 2 m × 2 m depending on variety and management practices.",
    tags: ["banana", "spacing"],
  },
  {
    crop: "Banana",
    season: "Year-round",
    state: "Kerala",
    stage: "Fertilizer",
    question: "What is the fertilizer recommendation for banana?",
    answer:
      "A typical recommendation is about 200–250 g N, 60–80 g P2O5, and 200–300 g K2O per plant per year in split applications along with organic manure.",
    tags: ["banana", "fertilizer"],
  },

  // --- COCONUT ---
  {
    crop: "Coconut",
    season: "Perennial",
    state: "Kerala",
    stage: "Management",
    question: "How can coconut yield be improved in Kerala?",
    answer:
      "Apply 50–60 kg well-decomposed FYM per palm per year, along with recommended NPK dose, maintain proper irrigation, and control pests like rhinoceros beetle and red palm weevil.",
    tags: ["coconut", "yield improvement"],
  },
  {
    crop: "Coconut",
    season: "Perennial",
    state: "Kerala",
    stage: "Irrigation",
    question: "How often should coconut palms be irrigated?",
    answer:
      "During summer, irrigate coconut palms once in 4–7 days depending on soil type and rainfall, avoiding waterlogging.",
    tags: ["coconut", "irrigation"],
  },
];


(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Mongo connected for seeding...");

    await Knowledge.deleteMany({});
    await Knowledge.insertMany(entries);

    console.log("Knowledge Seed Inserted");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
})();