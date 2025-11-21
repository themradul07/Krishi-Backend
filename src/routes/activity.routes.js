const express = require('express');
const router = express.Router();
const { addActivity, listActivities } = require('../controllers/activity.controller');

router.post('/add', addActivity);
router.get('/list/:farmerId', listActivities);

module.exports = router;
