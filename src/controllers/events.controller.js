const FarmerPlot = require("../models/FarmerPlot");
const CropEvent = require("../models/CropEvent");

const getTasks = async (req, res) => {
  try {
    const farmerId = req.farmerId;

    // Start and end of "today" in server timezone
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // Find all plots for this farmer and populate today's events
    const plots = await FarmerPlot.find({ farmerId })
      .populate({
        path: "calendar",
        match: {
        //   isCompleted: false,
          dueDate: { $gte: startOfToday, $lte: endOfToday },
        },
      })
      .lean();

    // Flatten only events that actually match today (and keep plot info)
    const tasksToday = [];

    plots.forEach((plot) => {
      (plot.calendar || []).forEach((event) => {
        tasksToday.push({
          plotId: plot._id,
          farmName: plot.farmName,
          cropName: plot.cropName,
          variety: plot.variety,
          sowingDate: plot.sowingDate,
          eventId: event._id,
          title: event.title,
          type: event.type,
          dueDate: event.dueDate,
          advice: event.advice,
          isCompleted: event.isCompleted,
        });
      });
    });

    return res.status(200).json({
      date: startOfToday,
      count: tasksToday.length,
      tasks: tasksToday,
    });
  } catch (err) {
    console.log(err);
     return res.status(500).json({
     err ,
    });


  }
};




// POST /tasks/update-status
const updateTask = async (req, res) => {
    try {
        const { eventId, isCompleted } = req.body;

        const task = await CropEvent.findOneAndUpdate(
            { _id: eventId},
            { isCompleted },
            { new: true }
        );

        if (!task) return res.status(404).json({ message: "Task not found" });

        res.json({
            message: "Task updated successfully",
            task
        });

    } catch (err) {
        console.error("Task update error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

const getplots = async(req, res) =>{
  try{
    const plots = await FarmerPlot.find({farmerId:req.farmerId}).select({
      farmName:1,
      _id:1
    });
    console.log(plots);
    res.json(plots);
  }catch(err){
    console.log(err);
    res.json(err);
  }

}

const createTask = async (req, res) => {
  try {
    console.log("this is the body", req.body);
    
    // Create and save CropEvent
    const event = await CropEvent.create(req.body);
    
    // Find the FarmerPlot by ID
    const plot = await FarmerPlot.findById(req.body.plotId);
    if (!plot) {
      return res.status(404).json({ message: "Plot not found" });
    }
    
    // Add event ID to calendar array
    plot.calendar.push(event._id);
    
    // Save the updated plot
    await plot.save();
    
    // Send success response
    res.status(201).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};




module.exports = { getTasks , updateTask,  getplots, createTask };
