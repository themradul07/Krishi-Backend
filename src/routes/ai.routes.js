const express = require('express');
const router = express.Router();

const { generate, detectCropDisease } = require('../controllers/ai.controller');
const multer = require('multer');
const upload = multer();

router.post('/generate', generate);
router.post('/detect-crop-disease', upload.single('image'), detectCropDisease);

module.exports = router;

