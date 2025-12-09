const express = require("express");
const router = express.Router();
const { updateNgoProfile, getDashboardStats, getRecentLoans, getNgoProfile, getLoanRequests } = require("../controllers/ngo.controller");
const auth = require("../middleware/auth");


router.get("/profile", auth , getNgoProfile);
router.post("/update", auth , updateNgoProfile);
router.get("/dashboard/stats", auth, getDashboardStats);
router.get("/dashboard/recent", auth, getRecentLoans);
router.get("/requests", auth, getLoanRequests);

module.exports = router;
