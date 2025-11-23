const Farmer = require('../models/Farmer');

const getFarmer = async (req, res) => {
  try {
<<<<<<< HEAD
    const farmer = await Farmer.findById(req.params.id).select('-password');
=======
    console.log("this is the " , req.farmerId);
    const farmer = await Farmer.findById(req.farmerId).select('-password');
>>>>>>> 373506706092d837eface72795e891d054b53edd
    if (!farmer) return res.status(404).json({ message: 'Farmer not found' });
    res.json(farmer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateFarmer = async (req, res) => {
  try {
    const updates = req.body;
<<<<<<< HEAD
=======
    console.log(updates);
>>>>>>> 373506706092d837eface72795e891d054b53edd
    const farmer = await Farmer.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    res.json(farmer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getFarmer, updateFarmer };
