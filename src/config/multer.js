import multer from "multer";

// const storage = multer.memoryStorage(); // <-- audio never saved to disk

export const upload = multer({ storage: multer.memoryStorage() });
