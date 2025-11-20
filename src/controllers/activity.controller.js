const Activity = require('../models/Activity');

const addActivity = async (req, res) => {
  try {
    const { farmerId, activity } = req.body;
    if (!farmerId || !activity) return res.status(400).json({ message: 'Missing fields' });
    const a = await Activity.create({ farmerId, activity });
    res.json(a);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const listActivities = async (req, res) => {
  try {
    const { farmerId } = req.params;
    const items = await Activity.find({ farmerId }).sort({ timestamp: -1 });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { addActivity, listActivities };
