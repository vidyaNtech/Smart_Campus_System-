const Attendance = require('../models/Attendance');

const getAttendance = async (req, res) => {
  try {
    const query = req.user.role === 'Admin' ? {} : { student: req.user._id };
    const attendance = await Attendance.find(query).populate('student', 'name email');
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAttendanceStats = async (req, res) => {
  try {
    const stats = await Attendance.aggregate([
      {
        $group: {
          _id: "$department",
          totalStudents: { $addToSet: "$student" },
          totalPresent: { $sum: { $cond: [{ $eq: ["$status", "Present"] }, 1, 0] } },
          totalRecords: { $sum: 1 }
        }
      },
      {
        $project: {
          department: "$_id",
          studentCount: { $size: "$totalStudents" },
          avgAttendance: { $multiply: [{ $divide: ["$totalPresent", "$totalRecords"] }, 100] }
        }
      }
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createAttendance = async (req, res) => {
  try {
    const { student, subject, date, status, department } = req.body;
    const attendance = new Attendance({ student, subject, date, status, department });
    const created = await attendance.save();
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await Attendance.findByIdAndUpdate(id, { status }, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAttendance, getAttendanceStats, createAttendance, updateAttendance };
