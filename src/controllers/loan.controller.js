const Loan = require("../models/Loan");
const Farmer = require("../models/Farmer");
const Ngo = require("../models/Ngo");
const { sendWhatsApp } = require("../services/whatsapp.service");

// -------------------------- APPLY LOAN (FARMER) -------------------------- //
exports.applyLoan = async (req, res) => {
    try {
        const farmerId = req.farmerId; // from JWT
        const { amount, purpose, ngoId } = req.body;

        if (!amount || !purpose || !ngoId) {
            return res.status(400).json({ success: false, message: "All fields required" });
        }

        const farmer = await Farmer.findById(farmerId);
        if (!farmer) {
            return res.status(404).json({ success: false, message: "Farmer not found" });
        }

        await Loan.create({
            farmerId,
            ngoId,
            farmerName: farmer.name,
            amount,
            purpose,
            status: "pending"
        });

        return res.json({
            success: true,
            message: "Loan application submitted successfully!"
        });

    } catch (err) {
        console.error("Apply Loan Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// --------------------------- GET NGO LOAN REQUESTS --------------------------- //
exports.getNgoLoanRequests = async (req, res) => {
    try {
        const userId = req.farmerId;
        const ngo = await Ngo.findOne({ farmerId: userId });

        if (!ngo) return res.status(404).json({ success: false, message: "NGO not found" });

        const requests = await Loan.find({ ngoId: ngo._id }).sort({ createdAt: -1 });

        return res.json({
            success: true,
            requests
        });

    } catch (err) {
        console.error("Loan Request Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
// --------------------------- APPROVE LOAN --------------------------- //
// exports.approveLoan = async (req, res) => {
//   try {
//     const userId = req.farmerId;
//     const ngo = await Ngo.findOne({ farmerId:userId });

//     const loanId = req.params.id;

//     const loan = await Loan.findOne({ _id: loanId, ngoId: ngo._id });

//     if (!loan) {
//       return res.status(404).json({ success: false, message: "Loan not found" });
//     }

//     loan.status = "approved";
//     const farmer = await Farmer.findOne({_id:loan.farmerId});
//     console.log("Farmer phone number:", farmer.phone);
//     await sendWhatsApp(farmer.phone , "Your loan Processed succefully. Please Contact on our customer number");
//     await loan.save();

//     return res.json({
//       success: true,
//       message: "Loan approved successfully!"
//     });

//   } catch (err) {
//     console.error("Approve Loan Error:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // --------------------------- DECLINE LOAN --------------------------- //
// exports.declineLoan = async (req, res) => {
//   try {
//     const userId = req.farmerId;
//     const ngo = await Ngo.findOne({ farmerId: userId });

//     const loanId = req.params.id;

//     const loan = await Loan.findOne({ _id: loanId, ngoId: ngo._id });

//     if (!loan) {
//       return res.status(404).json({ success: false, message: "Loan not found" });
//     }

//     loan.status = "declined";
//     const farmer = await Farmer.findOne({_id:loan.farmerId});
//     console.log("Farmer phone number:", farmer.phone);
//     await sendWhatsApp(farmer.phone , "Your loan has been declined. Please Contact on our customer number");
//     await loan.save();

//     return res.json({
//       success: true,
//       message: "Loan declined successfully!"
//     });

//   } catch (err) {
//     console.error("Decline Loan Error:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

exports.showLoans = async (req, res) => {
    try {
        console.log("Fetching all loans");
        const loans = await Ngo.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            message: "Loans fetched successfully",
            loans
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};

exports.approveLoan = async (req, res) => {
    try {
        const loanId = req.params.id;


        const updated = await Loan.findByIdAndUpdate(
            loanId,
            { status: "approved" },
            { new: true }
        );

        const farmerId = updated.farmerId;
        const farmer = await Farmer.findOne({ _id: farmerId });
        console.log("Farmer phone number:", farmer);
        await sendWhatsApp(farmer.phone, "Your loan Processed succefully. Please Contact on our customer number");
        if (!updated)
            return res.status(404).json({ success: false, message: "Loan not found" });

        res.json({ success: true, message: "Loan approved", loan: updated });

    } catch (err) {
        console.error("Approve Loan Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.declineLoan = async (req, res) => {
    try {
        const loanId = req.params.id;

        const updated = await Loan.findByIdAndUpdate(
            loanId,
            { status: "declined" },
            { new: true }
        );

        const farmerId = updated.farmerId;
        const farmer = await Farmer.findOne({ _id: farmerId });
        console.log("Farmer phone number:", farmer);
        await sendWhatsApp(farmer.phone, "Your loan Processed succefully. Please Contact on our customer number");

        if (!updated)
            return res.status(404).json({ success: false, message: "Loan not found" });

        res.json({ success: true, message: "Loan declined", loan: updated });

    } catch (err) {
        console.error("Decline Loan Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
