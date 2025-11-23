const express = require('express');
const router = express.Router();
const { weather } = require('../controllers/weather.controller');
<<<<<<< HEAD

router.get('/:location', weather);
=======
const { testWeatherAlert } = require("../controllers/weather.controller");

router.get('/:location', weather);
router.post("/test", testWeatherAlert);
>>>>>>> 373506706092d837eface72795e891d054b53edd

module.exports = router;
