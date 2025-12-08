const Scheme = require("../models/scheme");
const Farmer = require("../models/Farmer");


// Build dynamic filters
const buildFilters = (query) => {
  let filters = {};

  if (query.state) {
    filters["eligibility.state"] = query.state;
  }

  if (query.district) {
    filters["eligibility.district"] = query.district;
  }

  if (query.crop) {
    filters["eligibility.crops"] = query.crop;
  }

  if (query.minLand) {
    filters["eligibility.minLand"] = { $lte: Number(query.minLand) };
  }

  if (query.maxLand) {
    filters["eligibility.maxLand"] = { $gte: Number(query.maxLand) };
  }

  if (query.incomeLimit) {
    filters["eligibility.incomeLimit"] = { $gte: Number(query.incomeLimit) };
  }

  if (query.department) {
    filters.department = query.department;
  }

  // Search by name / description text
  if (query.search) {
    filters.$or = [
      { name: { $regex: query.search, $options: "i" } },
      { description: { $regex: query.search, $options: "i" } },
    ];
  }

  return filters;
};

// GET Schemes with Pagination + Filters
const getSchemes = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filters = buildFilters(req.query);

    const sort = req.query.sort || "-deadline"; // latest first

    const schemes = await Scheme.find(filters)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Scheme.countDocuments(filters);

    res.json({
      success: true,
      page,
      totalPages: Math.ceil(total / limit),
      totalResults: total,
      results: schemes,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// CREATE Scheme
const createScheme = async (req, res) => {
  try {
    const scheme = await Scheme.create(req.body);
    res.json({ success: true, scheme });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// GET Single Scheme
const getSchemeById = async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id);
    if (!scheme) {
      return res.status(404).json({ success: false, message: "Scheme not found" });
    }
    res.json({ success: true, scheme });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// UPDATE Scheme
const updateScheme = async (req, res) => {
  try {
    const scheme = await Scheme.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!scheme) {
      return res.status(404).json({ success: false, message: "Scheme not found" });
    }

    res.json({ success: true, scheme });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// DELETE Scheme
const deleteScheme = async (req, res) => {
  console.log("Delete scheme called");
  console.log("Delete scheme called with id:", req.params.id);
  try {
    const scheme = await Scheme.findByIdAndDelete(req.params.id);

    if (!scheme) {
      return res.status(404).json({ success: false, message: "Scheme not found" });
    }

    res.json({ success: true, message: "Scheme deleted successfully" });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};




// ------------------
// Eligibility Checker
// ------------------

// function isFarmerEligible(farmer, scheme, age, income) {
//   const e = scheme.eligibility;

//   // 1. Age check
//   console.log("this is the schema age" , e.maxAge , " this is fected" , age )
//   console.log("this is the age check" ,e.maxAge && age > e.maxAge)
//   if (e.maxAge && age > e.maxAge) return false;

//   // 2. Income check
//   // console.log("this is the income limit : " , e.incomeLimit && income > e.incomeLimit)
//   if (e.incomeLimit && income > e.incomeLimit) return false;

//   //caste
//   if (e.caste && e.caste.length > 0) {
//     if (!e.caste.includes(farmer.caste)) return false;
//   }

//   // // 3. State check
//   // if (e.state && e.state !== "All India") {
//   //   if (farmer.location.state !== e.state) return false;
//   // }

//   // 4. District check
//   // if (e.district && e.district.length > 0) {
//   //   if (!e.district.includes(farmer.location.district)) return false;
//   // }

//   // 5. Land size check
//   const land = parseFloat(farmer.landSize || 0);

//   if (e.minLand && land < e.minLand) return false;
//   if (e.maxLand && land > e.maxLand) return false;

//   // 6. Crop check
//   if (e.crops && e.crops.length > 0) {
//     if (!e.crops.includes(farmer.primaryCrop)) return false;
//   }

//   // 7. Irrigation check
//   // if (e.irrigationRequired && farmer.irrigation !== "yes") {
//   //   return false;
//   // }

//   return true;
// }

// // ------------------
// // Controller Function
// // ------------------

// const getEligibleSchemes = async (req, res) => {
//   try {
//     const farmerId = req.farmerId;
//     console.log("this is the req" ,req.body);
//     const { age, income ,caste} = req.body;

//     if (!age || !income || !caste) {
//       return res.status(400).json({ message: "Age,.Caste and income required" });
//     }

//     const farmer = await Farmer.findById(farmerId);
//     if (!farmer) {
//       return res.status(404).json({ message: "Farmer not found" });
//     }

//     const schemes = await Scheme.find();

//     const matchedSchemes = schemes.filter((scheme) =>
//       isFarmerEligible(farmer, scheme, age, income,caste)
//     );

//     return res.json({
//       farmer: farmer.name,
//       eligibleSchemes: matchedSchemes
//     });

//   } catch (err) {
//     console.error("Eligibility error:", err);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

function isFarmerEligible(farmer, scheme, age, income, caste) {
  const e = scheme.eligibility;

  // --------------------------
  // 1. AGE CHECK
  // --------------------------
  if (e.age) {
    if (e.age.min !== undefined && age < e.age.min) return false;
    if (e.age.max !== undefined && age > e.age.max) return false;
  }

  // --------------------------
  // 2. INCOME CHECK
  // --------------------------
  // If incomeLimit = null → no restriction
  if (e.incomeLimit !== null && income > e.incomeLimit) {
    return false;
  }

  // --------------------------
  // 3. CASTE CHECK
  // --------------------------
  if (e.caste && Array.isArray(e.caste) && e.caste.length > 0) {
    if (!e.caste.includes(caste)) return false;
  }

  // --------------------------
  // 4. LAND CHECK
  // --------------------------
  const land = Number(farmer.landSize || 0);

  if (e.minLand !== null && land < e.minLand) return false;
  if (e.maxLand !== null && land > e.maxLand) return false;

  // --------------------------
  // 5. CROPS CHECK
  // --------------------------
  if (e.crops && e.crops.length > 0) {
    if (!e.crops.includes(farmer.primaryCrop)) return false;
  }

  // --------------------------
  // 6. IRRIGATION CHECK
  // --------------------------
  if (e.irrigationRequired === true) {
    if (farmer.irrigation !== "yes") return false;
  }

  return true;
}

const getEligibleSchemes = async (req, res) => {
  try {
    const farmerId = req.farmerId;
    // console.log("this is the req" ,req.body);

    const { age, income, caste } = req.body;
    
  

    // console.log("this is the age" , age , " this is income " , income , " this is caste " , caste)
    if (age == null || income == null || !caste) {
      return res.status(400).json({ message: "Age, caste, and income are required" });
    }

    const farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({ message: "Farmer not found" });
    }

    // console.log("this is the farmer" , farmer)

    const schemes = await Scheme.find();
    console.log("this is the schemes" , schemes)

    const matchedSchemes = schemes.filter((scheme) =>
      isFarmerEligible(farmer, scheme, Number(age), Number(income), caste)
    );

    console.log("this is the matched schemes" , matchedSchemes)

    return res.json({
      farmer: farmer.name,
      eligibleSchemes: matchedSchemes
    });

  } catch (err) {
    console.error("Eligibility error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};







module.exports = {  getSchemes, createScheme, getSchemeById, updateScheme, deleteScheme,getEligibleSchemes };