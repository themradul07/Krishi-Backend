const express = require("express");
const router = express.Router();
const { predictSoil } = require("../controllers/soil.controller");

router.post("/predict", predictSoil);

module.exports = router;
