const express = require("express");
const router = express.Router();
const schemeController = require("../controllers/scheme.controller");

router.post("/add", schemeController.addScheme);
router.get("/all", schemeController.getAllSchemes);
router.get("/:id", schemeController.updateScheme);
router.get("/:id", schemeController.deleteScheme);

module.exports = router;
