const Farmer = require('../models/Farmer');
const FarmerPlot = require("../models/FarmerPlot");
const CropEvent = require("../models/CropEvent");
const { generateCropCalendar } = require("../utils/generateCalender");
const cropTemplates = require("../data/cropCalender");
const { default: mongoose } = require('mongoose');

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
    const farmerId = req.farmerId;
    const { cropName, variety, sowingDate,  farmName } = req.body;

    const plot = await FarmerPlot.create({
      farmerId,
      cropName,
      variety,
      sowingDate,
      farmName
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
        alertBefore: item.alertBefore,
        advice: item.advice
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

const showFarms = async(req , res)=>{
  const farmerId = req.farmerId;
  console.log("We are here");

  try{
  const farms = await FarmerPlot.find({ farmerId }).select({
  farmName: 1,
  sowingDate: 1,
  cropName: 1,
  variety: 1,

});

    res.json({
      message: "Fetch successful",
      farms      
    });

  }catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong" });
  }
}


const showParticularFarm = async (req, res) => {
  const farmerId = req.farmerId;
  const { id } = req.params;

  try {
    const [farm] = await FarmerPlot.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
          farmerId: new mongoose.Types.ObjectId(farmerId),
        },
      },
      {
        $lookup: {
          from: "cropevents",              // collection name in MongoDB
          localField: "calendar",          // array of ObjectId
          foreignField: "_id",
          as: "calendarEvents",
        },
      },
      {
        $addFields: {
          eventsByDate: {
            $map: {
              input: "$calendarEvents",
              as: "ev",
              in: {
                _id: "$$ev._id",
                title: "$$ev.title",
                type: "$$ev.type",
                dueDate: "$$ev.dueDate",
                isCompleted: "$$ev.isCompleted",
                advice : "$$ev.advice",
                dateKey: {
                  $dateToString: { format: "%Y-%m-%d", date: "$$ev.dueDate" },
                },
              },
            },
          },
        },
      },
      {
        $project: {
          farmerId: 1,
          farmName: 1,
          cropName: 1,
          variety: 1,
          sowingDate: 1,
          image: 1,
          // flat list for your React calendar
          events: "$eventsByDate",
        },
      },
    ]); // [web:43][web:56][web:58]

    if (!farm) {
      return res.status(404).json({ error: "Farm not found" });
    }

    res.json({
      message: "Fetch successful",
      farm,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = { getFarmer, updateFarmer, addCropToFarmer , showFarms, showParticularFarm};
