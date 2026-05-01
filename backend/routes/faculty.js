const express = require('express');
const router = express.Router();
const { getFaculty, createFaculty } = require('../controllers/facultyController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, getFaculty).post(protect, admin, createFaculty);

module.exports = router;
