const express = require('express');
const router = express.Router();

const { addActivity, listActivities } = require('../controllers/activity.controller');
const auth = require('../middleware/auth');

router.post('/add', auth, addActivity);
router.get('/list', auth, listActivities);

module.exports = router;

