// const cron = require("node-cron");
// const Scheme = require("../models/scheme");
// const Farmer = require("../models/Farmer");
// const { sendWhatsApp } = require("../services/whatsapp.service");


// // RUN EVERY DAY AT MIDNIGHT
// // cron.schedule("0 0 * * *", async () => {    


// //Run every minute for testing
// cron.schedule("*/1 * * * *", async () => {
//   console.log("🔍 Checking scheme deadlines...");

//   const today = new Date();
//   const threeDaysLater = new Date();
//   threeDaysLater.setDate(today.getDate() + 3);

//   try {
//     // Find schemes where deadline = today (last day)
//     const dueToday = await Scheme.find({
//       deadline: {
//         $gte: new Date(today.setHours(0, 0, 0)),
//         $lte: new Date(today.setHours(23, 59, 59))
//       }
//     });

//     // Find schemes where deadline = 3 days from now
//     const dueIn3Days = await Scheme.find({
//       deadline: {
//         $gte: new Date(threeDaysLater.setHours(0, 0, 0)),
//         $lte: new Date(threeDaysLater.setHours(23, 59, 59))
//       }
//     });

//     // Fetch all farmers
//     const farmers = await Farmer.find({});

//     // ALERT: 3 days before deadline
//     for (const scheme of dueIn3Days) {
//       farmers.forEach((farmer) => {
//         sendWhatsApp(
//           farmer.phone,
//           `⏳ Reminder: Only 3 days left to apply for "${scheme.name}"! Deadline: ${scheme.deadline.toDateString()}`
//         );
//       });
//     }

//     // ALERT: On the actual deadline day
//     for (const scheme of dueToday) {
//       farmers.forEach((farmer) => {
//         sendWhatsApp(
//           farmer.phone,
//           `⚠️ Today is the LAST DAY to apply for "${scheme.name}"! Deadline: ${scheme.deadline.toDateString()}`
//         );
//       });
//     }

//     console.log("✔ Deadline alerts sent!");

//   } catch (err) {
//     console.error("Cron Error:", err);
//   }
// });
