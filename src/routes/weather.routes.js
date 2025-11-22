const express = require('express');
const router = express.Router();
const { weather } = require('../controllers/weather.controller');
const { testWeatherAlert } = require("../controllers/weather.controller");

router.get('/:location', weather);
router.post("/test", testWeatherAlert);

module.exports = router;
