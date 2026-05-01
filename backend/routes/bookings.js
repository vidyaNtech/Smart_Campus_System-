const express = require('express');
const { getBookings, createBooking, suggestResources, updateBookingStatus } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(protect, getBookings).post(protect, createBooking);
router.route('/suggest').post(protect, suggestResources);
router.route('/:id').put(protect, updateBookingStatus);

module.exports = router;
