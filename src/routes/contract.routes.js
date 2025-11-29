const express = require("express");
const {
  createRequirement,
  getRequirements,
  getRequirementById,
  updateRequirement,
  deleteRequirement,
} = require("../controllers/contract.controller");

const router = express.Router();


router.post("/", createRequirement);
router.get("/", getRequirements);
router.get("/:id", getRequirementById);
router.put("/:id", updateRequirement);
router.delete("/:id", deleteRequirement);

module.exports = router;
