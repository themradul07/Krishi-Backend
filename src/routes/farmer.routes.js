const express = require('express');
const router = express.Router();
const { getFarmer, updateFarmer } = require('../controllers/farmer.controller');
const auth = require('../middleware/auth');

router.get('/:id', auth ,  getFarmer);
router.post('/:id', auth , updateFarmer);

module.exports = router;

