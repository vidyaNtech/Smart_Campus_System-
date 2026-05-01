const express = require('express');
const { getAnalytics, getStats, getHeatmap, getOptimizationReport } = require('../controllers/analyticsController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(protect, admin, getAnalytics);
router.route('/stats').get(protect, getStats);
router.route('/heatmap').get(protect, getHeatmap);
router.route('/optimization').get(protect, admin, getOptimizationReport);

module.exports = router;
