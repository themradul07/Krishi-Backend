const Activity = require('../models/Activity');

const addActivity = async (req, res) => {
  try {
    const activity = req.body;

    if (!activity || !activity.type) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const a = await Activity.create({
      farmerId: req.farmerId,
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

    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { addActivity, listActivities };
