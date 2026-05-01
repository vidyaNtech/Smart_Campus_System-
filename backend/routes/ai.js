const express = require('express');
const { processAIQuery } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/query', protect, processAIQuery);

module.exports = router;
