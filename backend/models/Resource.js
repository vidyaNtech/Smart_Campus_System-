const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['Classroom', 'Lab', 'Seminar Hall', 'Equipment', 'Library'],
  },
  capacity: {
    type: Number,
    required: true,
  },
  features: [String],
  status: {
    type: String,
    enum: ['Available', 'Maintenance', 'Inactive'],
    default: 'Available',
  },
  utilizationScore: {
    type: Number,
    default: 0, // A score for optimization logic
  }
}, { timestamps: true });

const Resource = mongoose.model('Resource', resourceSchema);
module.exports = Resource;
