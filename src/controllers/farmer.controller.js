const Farmer = require('../models/Farmer');
const FarmerPlot = require("../models/FarmerPlot");
const CropEvent = require("../models/CropEvent");
const { generateCropCalendar } = require("../utils/generateCalender");
const cropTemplates = require("../data/cropCalender");

//  GET FARMER PROFILE

const getFarmer = async (req, res) => {
  try {
    //farmerId comes from auth middleware
    console.log("this is the ", req.farmerId);
    const farmer = await Farmer.findById(req.farmerId).select('-password');
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    res.json(farmer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

//  UPDATE FARMER PROFILE

const updateFarmer = async (req, res) => {
  try {
    const updates = req.body;
    console.log("Incoming update:", updates);

    const farmer = await Farmer.findByIdAndUpdate(
      req.farmerId,
      updates,
      { new: true }
    ).select('-password');

    if (!farmer) {
      return res.status(404).json({ message: "Farmer not found" });
    }

    res.json(farmer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const addCropToFarmer = async (req, res) => {
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

module.exports = { getFarmer, updateFarmer, addCropToFarmer };
