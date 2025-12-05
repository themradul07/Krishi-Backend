const express = require('express');
const router = express.Router();

const {
  addFertilizer,
  searchFertilizer,
  getAllFertilizers
} = require('../controllers/fertilizer.controller');

router.post('/add', addFertilizer);
router.post('/search', searchFertilizer);
router.get('/all', getAllFertilizers);

module.exports = router;
