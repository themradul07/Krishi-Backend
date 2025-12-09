const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  applyLoan,
  getNgoLoanRequests,
  approveLoan,
  declineLoan,
  showLoans
} = require("../controllers/loan.controller");


// Farmer applies for loan
router.post("/apply", auth, applyLoan);

// NGO loan requests
router.get("/requests", auth, getNgoLoanRequests);

// NGO approves loan
router.put("/approve/:id", auth, approveLoan);

// NGO declines loan
router.put("/decline/:id", auth, declineLoan);

router.get("/all", showLoans);


module.exports = router;
