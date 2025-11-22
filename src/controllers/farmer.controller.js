const Farmer = require('../models/Farmer');

const getFarmer = async (req, res) => {
  try {
    console.log("this is the " , req.farmerId);
    const farmer = await Farmer.findById(req.farmerId).select('-password');
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
    console.log(updates);
    const farmer = await Farmer.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    res.json(farmer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getFarmer, updateFarmer };
