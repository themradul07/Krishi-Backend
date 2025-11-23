const express = require('express');
const router = express.Router();
const { addCropToFarmer } = require("../controllers/farmer.controller");
const { getFarmer, updateFarmer } = require('../controllers/farmer.controller');
const auth = require('../middleware/auth');

router.post("/add-crop", auth , addCropToFarmer);
router.get('/:id', auth ,  getFarmer);
router.post('/update', auth , updateFarmer);



module.exports = router;

