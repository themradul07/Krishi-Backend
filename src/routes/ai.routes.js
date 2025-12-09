const express = require('express');
const router = express.Router();
const { generate, detectCropDisease, generateAdvisory, detectPest, transcribeAudio, generateSuggestion, detectPesticide } = require('../controllers/ai.controller');

const auth = require('../middleware/auth');
const upload = require('../config/multer');


router.post('/generate', auth , generate);
router.post('/detect-crop-disease', auth ,upload.single('image'), detectCropDisease);
router.post('/detect-pest-disease', auth , upload.single('image'), detectPest);
router.post('/generate-advisory', auth, generateAdvisory);
router.post("/stt", upload.single("audio"), transcribeAudio);
router.post('/generate-suggestions', auth, generateSuggestion);
router.post('/detect-pesticide', auth , upload.single('image'), detectPesticide);



module.exports = router;

