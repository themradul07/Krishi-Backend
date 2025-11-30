// const cron = require("node-cron");
// const axios = require("axios");
// const Farmer = require("../models/Farmer");
// const { sendWhatsApp } = require("../services/whatsapp.service");

// const WEATHER_API = process.env.OPENWEATHER_API;

// cron.schedule("*/1 * * * *", async () => {
//   console.log("Running Weather Alert Cron...");

//   const farmers = await Farmer.find(); // all farmers

//   for (let farmer of farmers) {
//     const { latitude, longitude } = farmer.location;
//     console.log("Farmer Location:", latitude, longitude);
//     if(!latitude || !longitude) continue;

//     // 1. FETCH WEATHER
//     // https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
//     const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API}&units=metric`;
//     const res = await axios.get(url);
//     const weather = res.data.weather[0].main;
//     console.log(`Farmer: ${farmer.name}, Weather: ${weather}`);
//     const phone = farmer.phone;
//     if(!phone) continue;

//     // 2. DECISION LOGIC
//     if (weather === "Rain" || weather === "Thunderstorm"|| weather === "Haze") {
//       await sendWhatsApp(
//           phone,
//           "മഴ പെയ്യാൻ സാധ്യത. ഇന്ന് സ്പ്രേ ഒഴിവാക്കുക."
//       );
//       console.log("Weather alerts sent.");
//     }
//   }

// });
