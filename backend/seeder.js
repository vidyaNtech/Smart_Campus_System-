const mongoose = require('mongoose');
const User = require('./models/User');
const Resource = require('./models/Resource');
const Booking = require('./models/Booking');
const FacultyProfile = require('./models/FacultyProfile');
const Book = require('./models/Book');
const Attendance = require('./models/Attendance');

const importData = async () => {
  try {
    await User.deleteMany();
    await Resource.deleteMany();
    await Booking.deleteMany();
    await FacultyProfile.deleteMany();
    await Book.deleteMany();
    await Attendance.deleteMany();

    // 1. Create Users
    const admin = await User.create({ name: 'Principal Admin', email: 'admin@example.com', password: 'password', role: 'Admin', department: 'Management' });
    const faculty1 = await User.create({ name: 'Dr. Sarah Wilson', email: 'sarah@example.com', password: 'password', role: 'Faculty', department: 'Computer Science' });
    const faculty2 = await User.create({ name: 'Prof. David Miller', email: 'david@example.com', password: 'password', role: 'Faculty', department: 'Mechanical' });
    const staff = await User.create({ name: 'Mike Librarian', email: 'mike@example.com', password: 'password', role: 'Staff', department: 'Library' });
    const student1 = await User.create({ name: 'John Student', email: 'john@example.com', password: 'password', role: 'Student', department: 'Mechanical' });
    const student2 = await User.create({ name: 'Alice Doe', email: 'alice@example.com', password: 'password', role: 'Student', department: 'Computer Science' });
    const student3 = await User.create({ name: 'Bob Smith', email: 'bob@example.com', password: 'password', role: 'Student', department: 'Electrical' });

    // 2. Create Faculty Profiles
    await FacultyProfile.create({ user: faculty1._id, designation: 'Senior Professor', specialization: ['AI', 'Cloud Computing'], officeHours: 'Mon-Wed 2pm-4pm', cabinNumber: 'Block C-402' });
    await FacultyProfile.create({ user: faculty2._id, designation: 'Asst. Professor', specialization: ['Robotics', 'Dynamics'], officeHours: 'Tue-Thu 10am-12pm', cabinNumber: 'Block B-201' });

    // 3. Create Resources (Minimum 8 as requested)
    const resources = await Resource.create([
      { name: 'Einstein Hall', type: 'Classroom', capacity: 120, features: ['Smart Board', 'Surround Sound', 'AC'], liveStatus: 'Free' },
      { name: 'Turing Lab', type: 'Lab', capacity: 40, features: ['NVIDIA RTX 4090 Workstations', 'High Speed Internet'], liveStatus: 'Free' },
      { name: 'Tesla Seminar Hall', type: 'Seminar Hall', capacity: 250, features: ['Dual Projectors', 'Wireless Mics'], liveStatus: 'Free' },
      { name: 'Digital Library Wing', type: 'Library', capacity: 80, features: ['E-Readers', 'Silent Zone'], liveStatus: 'Free' },
      { name: 'Mechanical Workshop', type: 'Lab', capacity: 50, features: ['CNC Machines', '3D Printers'], liveStatus: 'Free' },
      { name: 'Conference Room A', type: 'Classroom', capacity: 20, features: ['Video Conferencing'], liveStatus: 'Free' },
      { name: 'Sports Complex Office', type: 'Equipment', capacity: 10, features: ['Gym Gear', 'Indoor Courts'], liveStatus: 'Free' },
      { name: 'Room 302 (Block A)', type: 'Classroom', capacity: 45, features: ['Standard AV'], liveStatus: 'Free' }
    ]);

    // 4. Create Books
    await Book.create([
      { title: 'Introduction to Algorithms', author: 'Cormen', isbn: '978-0262033848', category: 'Computing', copies: 5, available: 4 },
      { title: 'Clean Code', author: 'Robert Martin', isbn: '978-0132350884', category: 'Software Engineering', copies: 3, available: 3 },
      { title: 'Artificial Intelligence: A Modern Approach', author: 'Russell & Norvig', isbn: '978-0136042594', category: 'AI', copies: 2, available: 2 },
      { title: 'The Pragmatic Programmer', author: 'Andrew Hunt', isbn: '978-0135957059', category: 'General', copies: 4, available: 4 }
    ]);

    // 5. Create Attendance
    await Attendance.create([
      { student: student1._id, subject: 'Thermodynamics', date: new Date(), status: 'Present', department: 'Mechanical' },
      { student: student2._id, subject: 'Data Structures', date: new Date(), status: 'Absent', department: 'Computer Science' },
      { student: student3._id, subject: 'Circuit Theory', date: new Date(), status: 'Present', department: 'Electrical' }
    ]);

    // 6. Create Bookings
    await Booking.create({ 
      user: faculty1._id, 
      resource: resources[1]._id, // Turing Lab
      title: 'Advanced AI Seminar', 
      startTime: new Date(Date.now() + 3600000), 
      endTime: new Date(Date.now() + 7200000), 
      attendees: 25, 
      status: 'Confirmed' 
    });

    console.log('Sample Data Imported successfully for Demo!');
  } catch (error) {
    console.error('Seeding error:', error);
  }
};

module.exports = { importData };
