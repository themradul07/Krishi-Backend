const cron = require("node-cron");
const axios = require("axios");
const Farmer = require("../models/Farmer");
const { sendWhatsApp } = require("../services/whatsapp.service");

const WEATHER_API = process.env.OPENWEATHER_API;

// cron.schedule("*/1 * * * *", async () => {
//   console.log("Running Weather Alert Cron...");

//   const farmers = await Farmer.find(); // all farmers

//   for (let farmer of farmers) {
//     const { lat, lng, phone } = farmer.location;

//     // 1. FETCH WEATHER
//     // https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
//     const url = `https://api.openweathermap.org/data/2.5/weather?lat=9.931233&lon=76.267303&appid=${WEATHER_API}&units=metric`;
//     const res = await axios.get(url);
//     const weather = res.data.weather[0].main;

//     // 2. DECISION LOGIC
//     if (weather === "Rain" || weather === "Thunderstorm") {
//       await sendWhatsApp(
//         {body:  "മഴ പെയ്യാൻ സാധ്യത. ഇന്ന് സ്പ്രേ ഒഴിവാക്കുക." },
//         phone
//       );
//       console.log("Weather alerts sent.");
//     }
//   }

// });
