const express = require('express');
const router = express.Router();

const { weather, testWeatherAlert } = require('../controllers/weather.controller');


router.get('/:location', weather);
router.post('/test', testWeatherAlert);

module.exports = router;
