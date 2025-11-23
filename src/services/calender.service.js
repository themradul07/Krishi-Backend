// const cropData = require("../data/crop_calender.json"); // update path

// function generateCropCalendar(cropName, startDate) {
//   if (!cropData[cropName]) {
//     throw new Error("Crop not found in knowledge base");
//   }

//   const stages = cropData[cropName].stages;
//   let currentDate = new Date(startDate);

//   const calendar = stages.map(stage => {
//     const start = new Date(currentDate);
//     currentDate.setDate(currentDate.getDate() + stage.duration_days);
//     const end = new Date(currentDate);

//     return {
//       stage: stage.name,
//       startDate: start.toISOString().split("T")[0],
//       endDate: end.toISOString().split("T")[0],
//       duration: stage.duration_days,
//       advice: stage.advice
//     };
//   });

//   return {
//     crop: cropName,
//     startingFrom: startDate,
//     calendar
//   };
// }

// module.exports = { generateCropCalendar };


const CropEvent = require("../models/CropEvent");
const cropTemplates = require("../data/cropCalender");

exports.addCrop = async (req, res) => {
  try {
    const { farmerId, cropName, variety, sowingDate } = req.body;

    const plot = await FarmerPlot.create({
      farmerId,
      cropName,
      variety,
      sowingDate
    });

    // ---- GENERATE CALENDAR ----
    const template = cropTemplates[cropName];

    console.log("This is th template", cropTemplates[cropName]);

    if (!template) {
      return res.json({ message: "No calendar template found" });
    }

    let eventsToSave = [];

    template.forEach(item => {
      const due = new Date(sowingDate);
      due.setDate(due.getDate() + item.days);

      eventsToSave.push({
        plotId: plot._id,
        title: item.title,
        description: item.title,
        dueDate: due,
        alertBefore: item.alertBefore
      });
    });
    console.log("These are the events to be saved here",eventsToSave)

    const createdEvents = await CropEvent.insertMany(eventsToSave);

    plot.calendar = createdEvents.map(e => e._id);
    await plot.save();

    res.json({
      message: "Crop added + calendar created!",
      plot,
      events: createdEvents
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};
