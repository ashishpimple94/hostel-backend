const mongoose = require('mongoose');
require('dotenv').config();
const Student = require('./models/Student');
const Fee = require('./models/Fee');

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
    
    // Get first student
    const student = await Student.findOne();
    if (!student) {
      console.log('❌ No students found');
      process.exit(1);
    }
    
    console.log(`📝 Creating fees for ${student.firstName} ${student.lastName}`);
    
    // Create pending fees
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);
    
    await Fee.create({
      student: student._id,
      feeType: 'hostel',
      amount: 5000,
      dueDate: nextMonth,
      status: 'pending',
      semester: 1,
      year: 2024
    });
    
    await Fee.create({
      student: student._id,
      feeType: 'mess',
      amount: 3000,
      dueDate: nextMonth,
      status: 'pending',
      semester: 1,
      year: 2024
    });
    
    console.log('✅ Created 2 pending fees (Hostel: ₹5000, Mess: ₹3000)');
    
    // Now run sync
    const { execSync } = require('child_process');
    console.log('\n🔄 Syncing pending fees data...\n');
    const output = execSync('node syncPendingFees.js').toString();
    console.log(output);
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
})();
