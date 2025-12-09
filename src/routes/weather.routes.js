const express = require('express');
const router = express.Router();

const { weather, reverseGeo, testWeatherAlert } = require('../controllers/weather.controller');

// 1. Reverse geolocation (lat → city name)
router.get('/geo/reverse', reverseGeo);

// 2. Test weather alert
router.post('/test', testWeatherAlert);

// 3. Main weather API (KEEP THIS LAST)
router.get('/:location', weather);

module.exports = router;
