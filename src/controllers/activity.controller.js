const Activity = require('../models/Activity');

const addActivity = async (req, res) => {
  try {
    const activity = req.body;
    const farmerId = req.farmerId;

    if (!activity || !activity.type) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const a = await Activity.create({
      farmerId,
      ...activity
    });

    res.json(a);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const listActivities = async (req, res) => {
  try {

    const farmerId = req.farmerId;

    const items = await Activity.find({ farmerId }).sort({ timestamp: -1 });
    console.log("Fetched activities:", items);

    res.json({data : items});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { addActivity, listActivities };
