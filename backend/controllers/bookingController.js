const Booking = require('../models/Booking');
const Resource = require('../models/Resource');

// Helper function to find best fit alternative resources
const findAlternatives = async (startTime, endTime, attendees, type = null) => {
  // Find all resources that are booked in this time slot
  const conflictingBookings = await Booking.find({
    startTime: { $lt: endTime },
    endTime: { $gt: startTime },
    status: { $ne: 'Cancelled' }
  });

  const conflictingResourceIds = conflictingBookings.map(b => b.resource.toString());

  // Build query for available resources
  const query = {
    _id: { $nin: conflictingResourceIds },
    capacity: { $gte: attendees },
    status: 'Available'
  };

  if (type) {
    query.type = type;
  }

  // Find and sort by capacity difference (minimize waste) and utilization score
  const availableResources = await Resource.find(query).sort({ capacity: 1, utilizationScore: -1 }).limit(3);
  return availableResources;
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private
const getBookings = async (req, res) => {
  try {
    const query = req.user.role === 'Admin' ? {} : { user: req.user._id };
    const bookings = await Booking.find(query).populate('resource', 'name type capacity').populate('user', 'name email');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { resourceId, title, startTime, endTime, attendees } = req.body;

    const resource = await Resource.findById(resourceId);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });

    if (attendees > resource.capacity) {
      return res.status(400).json({ message: 'Attendees exceed resource capacity' });
    }

    // Conflict detection
    const conflictingBooking = await Booking.findOne({
      resource: resourceId,
      startTime: { $lt: endTime },
      endTime: { $gt: startTime },
      status: { $ne: 'Cancelled' }
    });

    if (conflictingBooking) {
      // Find alternatives
      const alternatives = await findAlternatives(startTime, endTime, attendees, resource.type);
      return res.status(409).json({
        message: 'Resource is already booked during this time slot.',
        conflict: true,
        alternatives
      });
    }

    const booking = new Booking({
      user: req.user._id,
      resource: resourceId,
      title,
      startTime,
      endTime,
      attendees,
    });

    const createdBooking = await booking.save();

    // Update utilization score (simple increment for demo purposes)
    resource.utilizationScore += 1;
    await resource.save();

    res.status(201).json(createdBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get optimization suggestions without booking
// @route   POST /api/bookings/suggest
// @access  Private
const suggestResources = async (req, res) => {
  try {
    const { startTime, endTime, attendees, type } = req.body;
    const alternatives = await findAlternatives(startTime, endTime, attendees, type);
    res.json(alternatives);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status (cancel, complete)
// @route   PUT /api/bookings/:id
// @access  Private
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (booking) {
      if (req.user.role !== 'Admin' && booking.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      booking.status = status;
      const updatedBooking = await booking.save();
      res.json(updatedBooking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getBookings, createBooking, suggestResources, updateBookingStatus };
