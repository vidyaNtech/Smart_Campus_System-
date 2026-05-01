const Book = require('../models/Book');
const LibraryIssue = require('../models/LibraryIssue');

const getBooks = async (req, res) => {
  try {
    const books = await Book.find({});
    res.json(books);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

const issueBook = async (req, res) => {
  try {
    const { bookId, userId, dueDate } = req.body;
    const book = await Book.findById(bookId);
    if (!book || book.available < 1) return res.status(400).json({ message: 'Book unavailable' });
    
    const issue = new LibraryIssue({ book: bookId, user: userId, dueDate });
    await issue.save();
    
    book.available -= 1;
    await book.save();
    
    res.status(201).json(issue);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

const getIssues = async (req, res) => {
  try {
    const query = req.user.role === 'Admin' ? {} : { user: req.user._id };
    const issues = await LibraryIssue.find(query).populate('book user', 'title name email');
    res.json(issues);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

const createBook = async (req, res) => {
  try {
    const { title, author, isbn, category, copies } = req.body;
    const book = new Book({ title, author, isbn, category, copies, available: copies });
    const created = await book.save();
    res.status(201).json(created);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

module.exports = { getBooks, issueBook, getIssues, createBook };
