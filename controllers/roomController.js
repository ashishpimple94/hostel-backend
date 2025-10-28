const Room = require('../models/Room');
const Student = require('../models/Student');

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Private
exports.getRooms = async (req, res) => {
  try {
    const { status, type, building } = req.query;
    let query = {};

    if (status) query.status = status;
    if (type) query.type = type;
    if (building) query.building = building;

    const rooms = await Room.find(query).populate('students');

    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get available rooms
// @route   GET /api/rooms/available
// @access  Private
exports.getAvailableRooms = async (req, res) => {
  try {
    const rooms = await Room.find({
      $expr: { $lt: ['$occupied', '$capacity'] },
      status: 'available'
    });

    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get room availability statistics
// @route   GET /api/rooms/availability-stats
// @access  Private
exports.getRoomAvailabilityStats = async (req, res) => {
  try {
    const rooms = await Room.find({ status: { $ne: 'maintenance' } }).populate('students', 'firstName lastName studentId');

    // Organize by AC/Non-AC and sharing type
    const stats = {
      nonAC: {
        fourSharing: { total: 0, occupied: 0, available: 0, beds: [] },
        twoSharing: { total: 0, occupied: 0, available: 0, beds: [] },
        oneSharing: { total: 0, occupied: 0, available: 0, beds: [] }
      },
      AC: {
        fourSharing: { total: 0, occupied: 0, available: 0, beds: [] },
        twoSharing: { total: 0, occupied: 0, available: 0, beds: [] },
        oneSharing: { total: 0, occupied: 0, available: 0, beds: [] }
      }
    };

    rooms.forEach(room => {
      const section = room.isAC ? 'AC' : 'nonAC';
      let sharingType;

      switch(room.type) {
        case 'quadruple':
          sharingType = 'fourSharing';
          break;
        case 'double':
          sharingType = 'twoSharing';
          break;
        case 'single':
          sharingType = 'oneSharing';
          break;
        default:
          return;
      }

      const availableBeds = room.capacity - room.occupied;
      stats[section][sharingType].total += room.capacity;
      stats[section][sharingType].occupied += room.occupied;
      stats[section][sharingType].available += availableBeds;

      // Add room details with bed information
      stats[section][sharingType].beds.push({
        roomNo: room.roomNo,
        building: room.building,
        floor: room.floor,
        capacity: room.capacity,
        occupied: room.occupied,
        available: availableBeds,
        beds: room.beds || [],
        students: room.students,
        rent: room.rent,
        rentFor5Months: room.rentFor5Months,
        messChargePerMonth: room.messChargePerMonth || 3000,
        messChargeFor5Months: room.messChargeFor5Months || 15000,
        status: room.status
      });
    });

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single room
// @route   GET /api/rooms/:id
// @access  Private
exports.getRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate('students');

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    res.status(200).json({
      success: true,
      data: room
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create room
// @route   POST /api/rooms
// @access  Private (Admin/Warden)
exports.createRoom = async (req, res) => {
  try {
    const room = await Room.create(req.body);

    res.status(201).json({
      success: true,
      data: room
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update room
// @route   PUT /api/rooms/:id
// @access  Private (Admin/Warden)
exports.updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    res.status(200).json({
      success: true,
      data: room
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Allocate student to room
// @route   POST /api/rooms/:id/allocate
// @access  Private (Admin/Warden)
exports.allocateRoom = async (req, res) => {
  try {
    const { studentId } = req.body;

    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Check if room is available
    if (room.occupied >= room.capacity) {
      return res.status(400).json({
        success: false,
        message: 'Room is full'
      });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Check if student already has a room
    if (student.roomNo) {
      return res.status(400).json({
        success: false,
        message: 'Student already has a room allocated'
      });
    }

    // Find first available bed
    const availableBed = room.beds.find(bed => !bed.isOccupied);
    if (!availableBed) {
      return res.status(400).json({
        success: false,
        message: 'No available beds in this room'
      });
    }

    // Allocate room and bed
    room.students.push(student._id);
    room.occupied += 1;
    availableBed.isOccupied = true;
    availableBed.studentId = student._id;
    await room.save();

    student.roomNo = room._id;
    student.allocationDate = new Date();
    await student.save();

    res.status(200).json({
      success: true,
      data: { room, student }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Deallocate student from room
// @route   POST /api/rooms/:id/deallocate
// @access  Private (Admin/Warden)
exports.deallocateRoom = async (req, res) => {
  try {
    const { studentId } = req.body;

    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Remove student from room and free the bed
    room.students = room.students.filter(
      s => s.toString() !== studentId.toString()
    );
    room.occupied -= 1;
    
    // Find and free the bed
    const studentBed = room.beds.find(bed => bed.studentId && bed.studentId.toString() === studentId.toString());
    if (studentBed) {
      studentBed.isOccupied = false;
      studentBed.studentId = null;
    }
    
    await room.save();

    student.roomNo = null;
    student.allocationDate = null;
    await student.save();

    res.status(200).json({
      success: true,
      data: { room, student }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete room
// @route   DELETE /api/rooms/:id
// @access  Private (Admin)
exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    if (room.occupied > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete room with allocated students'
      });
    }

    await room.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
