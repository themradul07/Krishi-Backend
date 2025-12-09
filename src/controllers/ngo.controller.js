const Ngo = require("../models/Ngo");
const Loan = require("../models/Loan");

// ------------------------ GET PROFILE ------------------------ //
exports.getNgoProfile = async (req, res) => {
  try {
    const userId = req.farmerId; // from JWT middleware

    // Correct: match userId, not farmerId
    let ngo = await Ngo.findOne({ farmerId: userId });

    // If NGO does not exist → create empty profile
    if (!ngo) {
      ngo = await Ngo.create({ farmerId: userId });
    }

    return res.json({
      success: true,
      ngo
    });

  } catch (err) {
    console.error("Get NGO Profile Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ------------------------ UPDATE PROFILE ------------------------ //
exports.updateNgoProfile = async (req, res) => {
  try {
    const userId = req.farmerId;

    // always fetch using userId
    let ngo = await Ngo.findOne({ farmerId: userId });

    if (!ngo) {
      ngo = await Ngo.create({ farmerId: userId });
    }

    const {
      name,
      email,
      phone,
      address,
      description,
      loanCriteria,
      interestRate,
      maxLoan,
      processingTime
    } = req.body;

    // -------------------- VALIDATION -------------------- //
    const errors = {};

    if (!name?.trim()) errors.name = "NGO name is required";
    if (!email?.trim()) errors.email = "Email is required";
    if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = "Invalid email";

    if (!phone?.trim()) errors.phone = "Phone is required";
    if (!/^[0-9]{10}$/.test(phone)) errors.phone = "Phone must be 10 digits";

    if (!address?.trim()) errors.address = "Address is required";
    if (!description?.trim()) errors.description = "Description is required";
    if (!loanCriteria?.trim()) errors.loanCriteria = "Loan eligibility criteria required";

    if (!interestRate) errors.interestRate = "Interest rate required";
    else if (interestRate < 1 || interestRate > 30)
      errors.interestRate = "Interest must be between 1%–30%";

    if (!maxLoan) errors.maxLoan = "Max loan amount required";
    if (!processingTime) errors.processingTime = "Processing time required";

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    // -------------------- UPDATE NGO -------------------- //
    const updatedNgo = await Ngo.findByIdAndUpdate(
      ngo._id,
      {
        name,
        email,
        phone,
        address,
        description,
        loanCriteria,
        interestRate,
        maxLoan,
        processingTime,
        profileCompleted: true
      },
      { new: true }
    );

    return res.json({
      success: true,
      message: "NGO profile updated successfully",
      ngo: updatedNgo
    });

  } catch (err) {
    console.error("Update NGO Profile Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ----------------- GET DASHBOARD STATS ----------------- //
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.farmerId;

    const ngo = await Ngo.findOne({ farmerId: userId });
    if (!ngo) return res.status(404).json({ success: false, message: "NGO not found" });

    const ngoId = ngo._id;

    const totalLoans = await Loan.countDocuments({ ngoId });
    const approved = await Loan.countDocuments({ ngoId, status: "approved" });
    const pending = await Loan.countDocuments({ ngoId, status: "pending" });
    const declined = await Loan.countDocuments({ ngoId, status: "declined" });

    const farmersSet = await Loan.distinct("farmerId", { ngoId });
    const totalFarmers = farmersSet.length;

    const totalDisbursedAgg = await Loan.aggregate([
      { $match: { ngoId, status: "approved" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const totalDisbursed =
      totalDisbursedAgg.length > 0 ? totalDisbursedAgg[0].total : 0;

    return res.json({
      success: true,
      stats: {
        totalLoans,
        approved,
        pending,
        declined,
        totalFarmers,
        totalDisbursed
      }
    });

  } catch (err) {
    console.error("Dashboard Stats Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ----------------- GET RECENT LOAN REQUESTS ----------------- //
exports.getRecentLoans = async (req, res) => {
  try {
    const userId = req.farmerId;

    const ngo = await Ngo.findOne({ farmerId: userId });
    if (!ngo) return res.status(404).json({ success: false, message: "NGO not found" });

    const loans = await Loan.find({ ngoId: ngo._id })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      loans
    });

  } catch (err) {
    console.error("Recent Loans Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getLoanRequests = async (req, res) => {
  try {
    const userId = req.farmerId;
    const ngo = await Ngo.findOne({ farmerId: userId });

    if (!ngo) {
      return res.status(404).json({ success: false, message: "NGO not found" });
    }

    const requests = await Loan.find({ ngoId: ngo._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      requests
    });

  } catch (err) {
    console.error("Loan Requests Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
