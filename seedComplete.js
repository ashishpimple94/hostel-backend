require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Student = require('./models/Student');
const Room = require('./models/Room');
const Fee = require('./models/Fee');
const Complaint = require('./models/Complaint');
const Attendance = require('./models/Attendance');
const Notice = require('./models/Notice');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear all existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Student.deleteMany({});
    await Room.deleteMany({});
    await Fee.deleteMany({});
    await Complaint.deleteMany({});
    await Attendance.deleteMany({});
    await Notice.deleteMany({});
    console.log('✅ Cleared existing data\n');

    // ==================== CREATE ROOMS ====================
    console.log('🏠 Creating rooms...');
    const rooms = [];
    const buildings = ['A', 'B', 'C'];
    const roomTypes = ['single', 'double', 'triple', 'quadruple'];
    const capacities = { single: 1, double: 2, triple: 3, quadruple: 4 };
    
    let roomCounter = 101;
    for (let building of buildings) {
      for (let floor = 1; floor <= 3; floor++) {
        for (let i = 0; i < 4; i++) {
          const type = roomTypes[Math.floor(Math.random() * roomTypes.length)];
          const room = await Room.create({
            roomNo: `${building}${roomCounter}`,
            floor: floor,
            building: building,
            type: type,
            capacity: capacities[type],
            occupied: 0,
            students: [],
            amenities: ['Bed', 'Study Table', 'Chair', 'Wardrobe', 'Fan'],
            rent: type === 'single' ? 5000 : type === 'double' ? 4000 : type === 'triple' ? 3000 : 2500,
            status: 'available'
          });
          rooms.push(room);
          roomCounter++;
        }
      }
    }
    console.log(`✅ Created ${rooms.length} rooms\n`);

    // ==================== CREATE STUDENTS ====================
    console.log('👨‍🎓 Creating students...');
    const students = [];
    const firstNames = ['Rahul', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Anjali', 'Rohit', 'Pooja', 'Arjun', 'Divya', 'Karan', 'Neha', 'Aditya', 'Riya', 'Sanjay'];
    const lastNames = ['Sharma', 'Kumar', 'Patel', 'Singh', 'Gupta', 'Verma', 'Reddy', 'Joshi', 'Mehta', 'Desai'];
    const departments = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical'];
    const courses = ['B.Tech', 'M.Tech', 'B.Sc', 'M.Sc'];

    for (let i = 0; i < 15; i++) {
      const firstName = firstNames[i];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const studentId = `STU${String(i + 1).padStart(3, '0')}`;
      
      const student = await Student.create({
        studentId: studentId,
        firstName: firstName,
        lastName: lastName,
        email: `${firstName.toLowerCase()}${i + 1}@student.com`,
        phone: `98765${String(43210 + i).padStart(5, '0')}`,
        dateOfBirth: new Date(2000 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        gender: i % 3 === 0 ? 'female' : 'male',
        bloodGroup: ['A+', 'B+', 'O+', 'AB+', 'A-'][Math.floor(Math.random() * 5)],
        address: {
          street: `${i + 1} MG Road`,
          city: ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad'][Math.floor(Math.random() * 5)],
          state: 'Maharashtra',
          pincode: `40000${i}`,
          country: 'India'
        },
        department: departments[Math.floor(Math.random() * departments.length)],
        course: courses[Math.floor(Math.random() * courses.length)],
        year: Math.floor(Math.random() * 4) + 1,
        semester: Math.floor(Math.random() * 8) + 1,
        enrollmentDate: new Date(2022, Math.floor(Math.random() * 12), 1),
        guardianName: `${firstName} ${lastName} Sr.`,
        guardianPhone: `99887${String(66554 + i).padStart(5, '0')}`,
        guardianRelation: i % 2 === 0 ? 'Father' : 'Mother',
        guardianEmail: `guardian${i + 1}@email.com`,
        status: 'active'
      });
      students.push(student);
    }
    console.log(`✅ Created ${students.length} students\n`);

    // ==================== ALLOCATE ROOMS ====================
    console.log('🔑 Allocating rooms to students...');
    for (let i = 0; i < 12; i++) {
      const student = students[i];
      const availableRoom = rooms.find(r => r.occupied < r.capacity);
      
      if (availableRoom) {
        availableRoom.students.push(student._id);
        availableRoom.occupied += 1;
        await availableRoom.save();
        
        student.roomNo = availableRoom._id;
        student.allocationDate = new Date();
        await student.save();
      }
    }
    console.log('✅ Allocated rooms to 12 students\n');

    // ==================== CREATE USERS ====================
    console.log('👤 Creating users...');
    const adminUser = await User.create({
      email: 'admin@hostel.com',
      password: 'admin123',
      role: 'admin'
    });

    const wardenUser = await User.create({
      email: 'warden@hostel.com',
      password: 'warden123',
      role: 'warden'
    });

    const accountantUser = await User.create({
      email: 'accountant@hostel.com',
      password: 'accountant123',
      role: 'accountant'
    });

    const maintenanceUser = await User.create({
      email: 'maintenance@hostel.com',
      password: 'maintenance123',
      role: 'maintenance'
    });

    // Create user accounts for all students
    for (let student of students) {
      await User.create({
        email: student.email,
        password: 'student123',
        role: 'student',
        studentId: student._id
      });
    }
    console.log(`✅ Created ${students.length + 4} user accounts\n`);

    // ==================== CREATE FEES ====================
    console.log('💰 Creating fees...');
    const feeTypes = ['hostel', 'mess', 'maintenance', 'security'];
    for (let student of students) {
      for (let feeType of feeTypes) {
        const amount = feeType === 'hostel' ? 5000 : feeType === 'mess' ? 3000 : feeType === 'security' ? 2000 : 1000;
        const isPaid = Math.random() > 0.4; // 60% paid
        
        await Fee.create({
          student: student._id,
          feeType: feeType,
          amount: amount,
          dueDate: new Date(2024, 11, 15), // Dec 15, 2024
          paidDate: isPaid ? new Date(2024, 10, Math.floor(Math.random() * 20) + 1) : null,
          status: isPaid ? 'paid' : Math.random() > 0.5 ? 'pending' : 'overdue',
          paymentMethod: isPaid ? ['upi', 'card', 'netbanking'][Math.floor(Math.random() * 3)] : null,
          transactionId: isPaid ? `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}` : null,
          semester: student.semester,
          year: student.year,
          createdBy: accountantUser._id
        });
      }
    }
    console.log('✅ Created fees for all students\n');

    // ==================== CREATE COMPLAINTS ====================
    console.log('📝 Creating complaints...');
    const complaintCategories = ['electrical', 'plumbing', 'furniture', 'cleaning', 'internet'];
    const complaintTitles = {
      electrical: ['Light not working', 'Fan issue', 'Socket damaged', 'No power in room'],
      plumbing: ['Tap leaking', 'Toilet flush problem', 'Water drainage issue', 'No hot water'],
      furniture: ['Broken chair', 'Table needs repair', 'Wardrobe door broken', 'Bed squeaking'],
      cleaning: ['Room not cleaned', 'Dustbin not emptied', 'Bathroom dirty', 'Corridor needs cleaning'],
      internet: ['WiFi not working', 'Slow internet', 'Cannot connect', 'WiFi password issue']
    };
    
    for (let i = 0; i < 20; i++) {
      const category = complaintCategories[Math.floor(Math.random() * complaintCategories.length)];
      const titles = complaintTitles[category];
      const title = titles[Math.floor(Math.random() * titles.length)];
      const student = students[Math.floor(Math.random() * students.length)];
      const statuses = ['pending', 'assigned', 'in-progress', 'resolved', 'closed'];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      const complaint = await Complaint.create({
        student: student._id,
        category: category,
        title: title,
        description: `${title} in my room. Please fix it as soon as possible.`,
        room: student.roomNo,
        priority: ['low', 'medium', 'high', 'urgent'][Math.floor(Math.random() * 4)],
        status: status,
        assignedTo: status !== 'pending' ? maintenanceUser._id : null,
        assignedBy: status !== 'pending' ? wardenUser._id : null,
        assignedDate: status !== 'pending' ? new Date() : null,
        resolvedDate: status === 'resolved' || status === 'closed' ? new Date() : null,
        resolution: status === 'resolved' || status === 'closed' ? 'Issue has been fixed successfully.' : null
      });
    }
    console.log('✅ Created 20 complaints\n');

    // ==================== CREATE ATTENDANCE ====================
    console.log('📋 Creating attendance records...');
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      for (let student of students.slice(0, 12)) {
        await Attendance.create({
          student: student._id,
          date: date,
          status: Math.random() > 0.1 ? 'present' : Math.random() > 0.5 ? 'absent' : 'late',
          checkInTime: new Date(date.setHours(8, Math.floor(Math.random() * 60))),
          checkOutTime: new Date(date.setHours(22, Math.floor(Math.random() * 60))),
          markedBy: wardenUser._id
        });
      }
    }
    console.log('✅ Created attendance records for last 7 days\n');

    // ==================== CREATE NOTICES ====================
    console.log('📢 Creating notices...');
    const notices = [
      {
        title: 'Hostel Fee Payment Reminder',
        content: 'All students are requested to pay their hostel fees by December 15, 2024. Late payment will attract penalty charges.',
        category: 'fee',
        priority: 'high',
        targetAudience: 'students'
      },
      {
        title: 'Maintenance Work Schedule',
        content: 'Water supply will be disrupted on Saturday from 10 AM to 2 PM due to maintenance work. Please plan accordingly.',
        category: 'maintenance',
        priority: 'medium',
        targetAudience: 'all'
      },
      {
        title: 'New WiFi Password',
        content: 'The hostel WiFi password has been changed. New password: Hostel@2024. Please update your devices.',
        category: 'general',
        priority: 'high',
        targetAudience: 'students'
      },
      {
        title: 'Annual Sports Day',
        content: 'Annual Sports Day will be held on December 20, 2024. All students are encouraged to participate. Registration closes on December 10.',
        category: 'event',
        priority: 'low',
        targetAudience: 'students'
      },
      {
        title: 'Fire Safety Drill',
        content: 'A fire safety drill will be conducted on Monday at 11 AM. All residents must participate. Attendance is mandatory.',
        category: 'urgent',
        priority: 'high',
        targetAudience: 'all'
      },
      {
        title: 'New Hostel Rules',
        content: 'Updated hostel rules are now in effect. Please check the notice board for complete details. Curfew time is now 11 PM.',
        category: 'rule',
        priority: 'high',
        targetAudience: 'students'
      }
    ];

    for (let noticeData of notices) {
      await Notice.create({
        ...noticeData,
        isActive: true,
        expiryDate: new Date(2025, 0, 31),
        postedBy: adminUser._id
      });
    }
    console.log('✅ Created 6 notices\n');

    // ==================== SUMMARY ====================
    console.log('\n' + '='.repeat(60));
    console.log('🎉 DATABASE SEEDED SUCCESSFULLY!');
    console.log('='.repeat(60));
    console.log('\n📊 Summary:');
    console.log(`   Rooms:      ${rooms.length} (12 occupied)`);
    console.log(`   Students:   ${students.length} (12 with rooms)`);
    console.log(`   Users:      ${students.length + 4}`);
    console.log(`   Fees:       ${students.length * 4}`);
    console.log(`   Complaints: 20`);
    console.log(`   Attendance: ${12 * 7} records`);
    console.log(`   Notices:    6`);
    
    console.log('\n📝 Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin:       admin@hostel.com       / admin123');
    console.log('Warden:      warden@hostel.com      / warden123');
    console.log('Accountant:  accountant@hostel.com  / accountant123');
    console.log('Maintenance: maintenance@hostel.com / maintenance123');
    console.log('Any Student: <student email>        / student123');
    console.log('  Example:   rahul1@student.com     / student123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n✅ All features are now ready to use!');
    console.log('🚀 Start the backend and frontend servers now.\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
