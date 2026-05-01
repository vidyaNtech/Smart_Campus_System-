const mongoose = require('mongoose');

const libraryIssueSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  issueDate: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
  returnDate: { type: Date },
  status: { type: String, enum: ['Issued', 'Returned', 'Overdue'], default: 'Issued' },
  fine: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('LibraryIssue', libraryIssueSchema);
