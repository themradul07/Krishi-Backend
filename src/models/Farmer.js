const mongoose = require('mongoose');
<<<<<<< HEAD
=======


>>>>>>> 373506706092d837eface72795e891d054b53edd
const FarmerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  crop: { type: String, default: '' },
  soilType: { type: String, default: '' },
<<<<<<< HEAD
  location: { type: String, default: '' }
=======
  location: { type: String, default: '' },
  irrigation: { type: String , default: '' },

>>>>>>> 373506706092d837eface72795e891d054b53edd
}, { timestamps: true });
module.exports = mongoose.model('Farmer', FarmerSchema);
