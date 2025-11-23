const express = require('express');
const router = express.Router();
const { addActivity, listActivities } = require('../controllers/activity.controller');
<<<<<<< HEAD

router.post('/add', addActivity);
router.get('/list/:farmerId', listActivities);
=======
const auth = require('../middleware/auth');

router.post('/add', auth ,  addActivity);
router.get('/list', auth , listActivities);
>>>>>>> 373506706092d837eface72795e891d054b53edd

module.exports = router;
