const cron = require("node-cron");
const CropEvent = require("../models/CropEvent");
const { sendWhatsApp } = require("../services/whatsapp.service");

// cron.schedule("* * */1 * *", async () => {
//   console.log("Crop Alerts are in queue");
//   const now = new Date();
//   const today = new Date();
//   today.setUTCHours(0, 0, 0, 0);



//   console.log("this is the date today", today);





//   const events = await CropEvent.find({
//     dueDate: today,
//     isCompleted: false
//   }).populate("plotId");
//   console.log("these are events", events)
//   events.forEach(async (ev) => {
//     await sendWhatsApp(`"Sending alert for:", ${ev.title}`, "+919140395305");
//     console.log("Sending alert for:", ev.title);
//   });
// });
