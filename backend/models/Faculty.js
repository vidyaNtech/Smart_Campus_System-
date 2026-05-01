const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  designation: { type: String, required: true },
  courses: [String],
  status: { type: String, enum: ['Active', 'On Leave', 'Inactive'], default: 'Active' },
}, { timestamps: true });

module.exports = mongoose.model('Faculty', facultySchema);
