const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  phone: {
    type: String,
    default: 'Not provided'
  },
  dateOfBirth: {
    type: Date,
    default: Date.now
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    default: 'other'
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: String
  },
  // Academic Info
  department: {
    type: String,
    default: 'Not Assigned'
  },
  course: {
    type: String,
    default: 'Not Assigned'
  },
  year: {
    type: Number,
    default: 1
  },
  semester: {
    type: Number,
    default: 1
  },
  enrollmentDate: {
    type: Date,
    default: Date.now
  },
  // Guardian Info
  guardianName: {
    type: String,
    default: 'To be updated'
  },
  guardianPhone: {
    type: String,
    default: 'To be updated'
  },
  guardianRelation: {
    type: String,
    default: 'To be updated'
  },
  guardianEmail: String,
  // Room Allocation
  roomNo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room'
  },
  allocationDate: Date,
  // Status
  status: {
    type: String,
    enum: ['active', 'inactive', 'graduated', 'suspended'],
    default: 'active'
  },
  // Pending Fees Information
  hasPendingFees: {
    type: Boolean,
    default: false
  },
  totalPendingAmount: {
    type: Number,
    default: 0
  },
  pendingFeesFrom: {
    type: Date
  },
  pendingFeesUntil: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

studentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Student', studentSchema);
