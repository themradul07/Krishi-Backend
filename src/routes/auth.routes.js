const express = require('express');
const router = express.Router();
const { register, login, verifyOtp, googleLogin } = require('../controllers/auth.controller');

router.post('/register', register);
router.post('/verify', verifyOtp);
router.post('/login', login);
router.post('/google', googleLogin);



module.exports = router;
