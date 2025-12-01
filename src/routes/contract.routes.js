const express = require("express");
const {
  createRequirement,
  getRequirements,
  getRequirementById,
  updateRequirement,
  deleteRequirement,
} = require("../controllers/contract.controller");
const auth = require("../middleware/auth");

const router = express.Router();


router.post("/", auth ,createRequirement);
router.get("/",auth, getRequirements);
router.get("/:id", auth, getRequirementById);
router.put("/:id", auth, updateRequirement);
router.delete("/:id", auth , deleteRequirement);

module.exports = router;
