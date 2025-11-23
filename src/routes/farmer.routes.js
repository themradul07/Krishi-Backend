const express = require('express');
const router = express.Router();
const { getFarmer, updateFarmer } = require('../controllers/farmer.controller');
<<<<<<< HEAD

router.get('/:id', getFarmer);
router.put('/:id', updateFarmer);

module.exports = router;
=======
const auth = require('../middleware/auth');

router.get('/:id', auth ,  getFarmer);
router.post('/:id', auth , updateFarmer);

module.exports = router;

>>>>>>> 373506706092d837eface72795e891d054b53edd
