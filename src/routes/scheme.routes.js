const express = require("express");
const router = express.Router();

const {
    getSchemes,
    createScheme,
    getSchemeById,
    updateScheme,
    deleteScheme,
    getEligibleSchemes,
} = require("../controllers/scheme.controller");
const auth = require("../middleware/auth");

router.get("/", getSchemes);
router.post("/", createScheme);
router.post("/eligible", auth ,  getEligibleSchemes);
router.get("/:id", getSchemeById);
router.put("/:id", updateScheme);
router.delete("/:id", deleteScheme);

module.exports = router;