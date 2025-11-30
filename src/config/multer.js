const multer = require("multer");

// const storage = multer.memoryStorage(); // <-- audio never saved to disk

const upload = multer({ storage: multer.memoryStorage() });

module.exports = upload;
