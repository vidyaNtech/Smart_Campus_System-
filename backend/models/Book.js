const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, unique: true },
  category: { type: String },
  copies: { type: Number, default: 1 },
  available: { type: Number, default: 1 },
  location: { type: String }, // Shelf location
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
