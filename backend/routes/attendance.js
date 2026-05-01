const express = require('express');
const router = express.Router();
const { getAttendance, getAttendanceStats, createAttendance, updateAttendance } = require('../controllers/attendanceController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, getAttendance).post(protect, admin, createAttendance);
router.route('/stats').get(protect, admin, getAttendanceStats);
router.route('/:id').put(protect, admin, updateAttendance);

module.exports = router;
