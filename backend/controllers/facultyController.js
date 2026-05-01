const Faculty = require('../models/Faculty');

const getFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.find({});
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createFaculty = async (req, res) => {
  try {
    const faculty = new Faculty(req.body);
    const created = await faculty.save();
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getFaculty, createFaculty };
