const express = require('express');
const router = express.Router();
const { getBooks, issueBook, getIssues, createBook } = require('../controllers/libraryController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/books', protect, getBooks);
router.post('/books', protect, admin, createBook);
router.post('/issue', protect, admin, issueBook);
router.get('/issues', protect, getIssues);

module.exports = router;
