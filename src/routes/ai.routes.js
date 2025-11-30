const express = require('express');
const router = express.Router();

const { generate, detectCropDisease, generateAdvisory, detectPest, transcribeAudio, generateSuggestion } = require('../controllers/ai.controller');
const multer = require('multer');
const auth = require('../middleware/auth');
const { upload } = require('../config/multer.JS');


router.post('/generate', auth , generate);
router.post('/detect-crop-disease', upload.single('image'), detectCropDisease);
router.post('/detect-pest-disease', upload.single('image'), detectPest);
router.post('/generate-advisory', auth, generateAdvisory);
router.post("/stt", upload.single("audio"), transcribeAudio);
router.post('/generate-suggestions', auth, generateSuggestion);


module.exports = router;

