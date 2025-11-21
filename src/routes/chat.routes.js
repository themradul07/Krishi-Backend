const express = require('express');
const router = express.Router();
const { storeChat, history } = require('../controllers/chat.controller');

router.post('/store', storeChat);
router.get('/history/:farmerId', history);

module.exports = router;
