const Activity = require('../models/Activity');

const addActivity = async (req, res) => {
  try {
<<<<<<< HEAD
    const { farmerId, activity } = req.body;
    if (!farmerId || !activity) return res.status(400).json({ message: 'Missing fields' });
    const a = await Activity.create({ farmerId, activity });
=======
    console.log(req.body);
    const  activity  = req.body;
    console.log(activity);
    if ( !activity) return res.status(400).json({ message: 'Missing fields' });
    const a = await Activity.create({ farmerId: req.farmerId, ...activity });
    console.log(a);
>>>>>>> 373506706092d837eface72795e891d054b53edd
    res.json(a);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const listActivities = async (req, res) => {
  try {
<<<<<<< HEAD
    const { farmerId } = req.params;
=======
    const farmerId  = req.farmerId;
>>>>>>> 373506706092d837eface72795e891d054b53edd
    const items = await Activity.find({ farmerId }).sort({ timestamp: -1 });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { addActivity, listActivities };
