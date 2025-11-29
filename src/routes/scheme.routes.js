const express = require("express");
const router = express.Router();

const {
    getSchemes,
    createScheme,
    getSchemeById,
    updateScheme,
    deleteScheme,
} = require("../controllers/scheme.controller");

router.get("/", getSchemes);
router.post("/", createScheme);
router.get("/:id", getSchemeById);
router.put("/:id", updateScheme);
router.delete("/:id", deleteScheme);

module.exports = router;
