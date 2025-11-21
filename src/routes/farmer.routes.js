const express = require('express');
const router = express.Router();
const { getFarmer, updateFarmer } = require('../controllers/farmer.controller');

router.get('/:id', getFarmer);
router.put('/:id', updateFarmer);

module.exports = router;
