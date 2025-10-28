require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Student = require('./models/Student');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

const seedUsers = async () => {
  try {
    await connectDB();

    // Clear existing users
    await User.deleteMany({});
    await Student.deleteMany({});
    console.log('Cleared existing data');

    // Create a sample student record
    const student = await Student.create({
      studentId: 'STU001',
      firstName: 'John',
      lastName: 'Doe',
      email: 'student@hostel.com',
      phone: '1234567890',
      dateOfBirth: new Date('2000-01-01'),
      gender: 'male',
      department: 'Computer Science',
      course: 'B.Tech',
      year: 2,
      semester: 4,
      guardianName: 'Jane Doe',
      guardianPhone: '9876543210',
      guardianRelation: 'Mother',
      status: 'active'
    });

    // Create users
    const users = [
      {
        email: 'admin@hostel.com',
        password: 'admin123',
        role: 'admin'
      },
      {
        email: 'warden@hostel.com',
        password: 'warden123',
        role: 'warden'
      },
      {
        email: 'accountant@hostel.com',
        password: 'accountant123',
        role: 'accountant'
      },
      {
        email: 'maintenance@hostel.com',
        password: 'maintenance123',
        role: 'maintenance'
      },
      {
        email: 'student@hostel.com',
        password: 'student123',
        role: 'student',
        studentId: student._id
      }
    ];

    for (let userData of users) {
      const user = await User.create(userData);
      console.log(`✅ Created ${userData.role}: ${userData.email}`);
    }

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin:       admin@hostel.com       / admin123');
    console.log('Warden:      warden@hostel.com      / warden123');
    console.log('Accountant:  accountant@hostel.com  / accountant123');
    console.log('Maintenance: maintenance@hostel.com / maintenance123');
    console.log('Student:     student@hostel.com     / student123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedUsers();
