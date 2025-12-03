// const { sendWhatsApp } = require("../services/whatsapp.service");
// const cron = require("node-cron");
// const CropEvent = require("../models/CropEvent");
// const Farmer = require("../models/Farmer");
// cron.schedule("*/1 * * * *", async () => {
//   try {
//     console.log("Hello the crop ")
//     const now = new Date();
//     const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24h window
    
//     const dueEvents = await CropEvent.find({
//       dueDate: { $gte: now, $lte: tomorrow },
//       isCompleted: false
//     }).populate('plotId', 'farmerId cropName'); // Populate farmer/plot details

    
    

//     for (const event of dueEvents) {
//         const farmer = await Farmer.find({_id:event.plotId.farmerId});
//         console.log(farmer);
//         if (!farmer.phone ) continue;
//         console.log(dueEvents);
//         await sendWhatsApp(farmer.phone ,  event.title);      
//     }
    
//     console.log(`Checked ${dueEvents.length} due events at ${now}`);
//   } catch (error) {
//     console.error('Scheduler error:', error);
//   }
// })
