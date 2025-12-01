const express = require("express");
const { getNearbyServices } = require("../controllers/agriService.controller");

const router = express.Router();

// GET /api/agri-services?lat=..&lng=..&category=shop
router.get("/", getNearbyServices);

module.exports = router;
