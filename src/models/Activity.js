const mongoose = require('mongoose');
const ActivitySchema = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
<<<<<<< HEAD
  activity: { type: String, required: true },
=======
  type: { type: String, required: true },
 note : { type: String  },
>>>>>>> 373506706092d837eface72795e891d054b53edd
  timestamp: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Activity', ActivitySchema);
