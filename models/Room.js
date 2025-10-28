const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNo: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  floor: {
    type: Number,
    required: true
  },
  building: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['single', 'double', 'triple', 'quadruple'],
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  isAC: {
    type: Boolean,
    default: false
  },
  isBunk: {
    type: Boolean,
    default: false
  },
  occupied: {
    type: Number,
    default: 0
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  amenities: [{
    type: String
  }],
  rent: {
    type: Number,
    required: true
  },
  rentFor5Months: {
    type: Number,
    required: true
  },
  extraCharge1to2Months: {
    type: Number,
    default: 2000
  },
  extraCharge3to4Months: {
    type: Number,
    default: 1000
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'maintenance', 'unavailable'],
    default: 'available'
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

// Virtual for availability
roomSchema.virtual('isAvailable').get(function() {
  return this.occupied < this.capacity && this.status === 'available';
});

roomSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  // Update status based on occupancy
  if (this.occupied >= this.capacity) {
    this.status = 'occupied';
  } else if (this.occupied === 0 && this.status === 'occupied') {
    this.status = 'available';
  }
  next();
});

module.exports = mongoose.model('Room', roomSchema);
