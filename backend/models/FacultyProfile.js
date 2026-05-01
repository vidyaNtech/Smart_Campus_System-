const mongoose = require('mongoose');

const facultyProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  designation: { type: String, required: true },
  specialization: [String],
  officeHours: { type: String },
  cabinNumber: { type: String },
  joiningDate: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('FacultyProfile', facultyProfileSchema);
