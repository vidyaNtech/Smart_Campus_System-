const Resource = require('../models/Resource');
const Booking = require('../models/Booking');

// @desc    Get all resources (with search & filter)
// @route   GET /api/resources?type=Lab&search=computer&status=Available
// @access  Private
const getResources = async (req, res) => {
  try {
    const { type, search, status, minCapacity } = req.query;
    const query = {};

    if (type) query.type = type;
    if (status) query.status = status;
    if (minCapacity) query.capacity = { $gte: Number(minCapacity) };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { type: { $regex: search, $options: 'i' } }
      ];
    }

    const resources = await Resource.find(query).sort({ utilizationScore: -1 });

    // Augment with live booking status
    const now = new Date();
    const activeBookings = await Booking.find({
      status: 'Confirmed',
      startTime: { $lte: now },
      endTime: { $gte: now }
    });
    const activeResourceIds = new Set(activeBookings.map(b => b.resource.toString()));

    const enriched = resources.map(r => ({
      ...r.toObject(),
      currentlyBooked: activeResourceIds.has(r._id.toString()),
      liveStatus: activeResourceIds.has(r._id.toString()) ? 'Occupied' : r.status === 'Available' ? 'Free' : r.status
    }));

    res.json(enriched);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a resource
// @route   POST /api/resources
// @access  Private/Admin
const createResource = async (req, res) => {
  try {
    const { name, type, capacity, features } = req.body;
    const resource = new Resource({ name, type, capacity, features });
    const createdResource = await resource.save();
    res.status(201).json(createdResource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a resource
// @route   PUT /api/resources/:id
// @access  Private/Admin
const updateResource = async (req, res) => {
  try {
    const { name, type, capacity, features, status } = req.body;
    const resource = await Resource.findById(req.params.id);

    if (resource) {
      resource.name = name || resource.name;
      resource.type = type || resource.type;
      resource.capacity = capacity || resource.capacity;
      resource.features = features || resource.features;
      resource.status = status || resource.status;

      const updatedResource = await resource.save();
      res.json(updatedResource);
    } else {
      res.status(404).json({ message: 'Resource not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a resource
// @route   DELETE /api/resources/:id
// @access  Private/Admin
const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (resource) {
      await Resource.deleteOne({ _id: resource._id });
      res.json({ message: 'Resource removed' });
    } else {
      res.status(404).json({ message: 'Resource not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getResources, createResource, updateResource, deleteResource };
