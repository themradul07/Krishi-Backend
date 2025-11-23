const express = require('express');
const router = express.Router();
<<<<<<< HEAD
const { generate } = require('../controllers/ai.controller');

router.post('/generate', generate);
=======
const { generate, detectCropDisease } = require('../controllers/ai.controller');
const multer = require('multer');
const upload = multer();

router.post('/generate',generate);
router.post('/detect-crop-disease', upload.single('image'), detectCropDisease);

>>>>>>> 373506706092d837eface72795e891d054b53edd

module.exports = router;
