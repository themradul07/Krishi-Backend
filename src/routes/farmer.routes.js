const express = require('express');
const router = express.Router();
const { addCropToFarmer, showFarms, showParticularFarm } = require("../controllers/farmer.controller");
const { getFarmer, updateFarmer } = require('../controllers/farmer.controller');
const auth = require('../middleware/auth');


router.post("/add-crop", auth , addCropToFarmer);
router.get("/allFarms", auth , showFarms);
router.get("/allfarms/:id", auth, showParticularFarm )

router.get('/:id', auth ,  getFarmer);
router.post('/update', auth , updateFarmer);



module.exports = router;
