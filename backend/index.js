const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/resources', require('./routes/resources'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/faculty', require('./routes/faculty'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/library', require('./routes/library'));
app.use('/api/ai', require('./routes/ai'));

// Error logging
app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

const PORT = process.env.PORT || 5000;

const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

// Database connection
const connectDB = async () => {
  try {
    let mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      mongoServer = await MongoMemoryServer.create();
      mongoURI = mongoServer.getUri();
      console.log('Using in-memory MongoDB');
    }

    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
    
    // Auto-seed for demo if in-memory
    if (!process.env.MONGO_URI) {
       require('./seeder').importData();
    }
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Database connection error:', err.message);
    process.exit(1);
  }
};

connectDB();
