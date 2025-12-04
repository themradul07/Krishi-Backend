
const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const { getTasks, updateTask, getplots, createTask } = require('../controllers/events.controller');



router.get('/today' , auth , getTasks);
router.post('/update', auth , updateTask);
router.get('/plots', auth , getplots  );
router.post('/add' , auth , createTask )



module.exports = router;

