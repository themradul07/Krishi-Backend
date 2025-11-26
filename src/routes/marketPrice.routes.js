const express = require("express");
const router = express.Router();
const marketPriceController = require("../controllers/marketPrice.controller");

router.post("/add", marketPriceController.addMarketPrice);
router.get("/all", marketPriceController.getAllMarketPrices);
router.get("/:id", marketPriceController.updateMarketPrice);
router.get("/:id", marketPriceController.deleteMarketPrice);

module.exports = router;
