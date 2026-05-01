const express = require('express');
const { registerUser, authUser, getUsers } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/users', protect, admin, getUsers);

module.exports = router;
