const express = require('express');
const router = express.Router();
const { weather } = require('../controllers/weather.controller');

router.get('/:location', weather);

module.exports = router;
