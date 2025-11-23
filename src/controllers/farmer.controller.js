const Farmer = require('../models/Farmer');

//  GET FARMER PROFILE

const getFarmer = async (req, res) => {
  try {
    //farmerId comes from auth middleware
    console.log("Authenticated farmer:", req.farmerId);

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
      req.params.id,
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

module.exports = { getFarmer, updateFarmer };
