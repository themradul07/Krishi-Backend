
const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const { getTasks, updateTask } = require('../controllers/events.controller');



router.get('/today' , auth , getTasks);
router.post('/update', auth , updateTask);



module.exports = router;

