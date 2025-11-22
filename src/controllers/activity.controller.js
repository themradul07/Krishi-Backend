const Activity = require('../models/Activity');

const addActivity = async (req, res) => {
  try {
    console.log(req.body);
    const  activity  = req.body;
    console.log(activity);
    if ( !activity) return res.status(400).json({ message: 'Missing fields' });
    const a = await Activity.create({ farmerId: req.farmerId, ...activity });
    console.log(a);
    res.json(a);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const listActivities = async (req, res) => {
  try {
    const farmerId  = req.farmerId;
    const items = await Activity.find({ farmerId }).sort({ timestamp: -1 });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { addActivity, listActivities };
