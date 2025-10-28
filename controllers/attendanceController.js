const Attendance = require('../models/Attendance');

exports.getAttendance = async (req, res) => {
  try {
    const { student, status, startDate, endDate } = req.query;
    let query = {};

    if (student) query.student = student;
    if (status) query.status = status;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const attendance = await Attendance.find(query)
      .populate('student')
      .sort('-date');

    res.status(200).json({ success: true, count: attendance.length, data: attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markAttendance = async (req, res) => {
  try {
    req.body.markedBy = req.user.id;
    const attendance = await Attendance.create(req.body);
    res.status(201).json({ success: true, data: attendance });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Attendance already marked for this student today'
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!attendance) {
      return res.status(404).json({ success: false, message: 'Attendance not found' });
    }

    res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStudentAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ student: req.params.studentId }).sort('-date');
    res.status(200).json({ success: true, count: attendance.length, data: attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markBulkAttendance = async (req, res) => {
  try {
    const { date, attendanceRecords } = req.body; // attendanceRecords: [{ student, status, remarks }]
    
    const results = {
      success: [],
      failed: []
    };

    for (const record of attendanceRecords) {
      try {
        const attendance = await Attendance.create({
          student: record.student,
          date: date || new Date(),
          status: record.status,
          remarks: record.remarks,
          markedBy: req.user.id
        });
        results.success.push(attendance);
      } catch (error) {
        results.failed.push({
          student: record.student,
          error: error.message
        });
      }
    }

    res.status(201).json({
      success: true,
      data: results,
      message: `${results.success.length} records created, ${results.failed.length} failed`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAttendanceStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let dateQuery = {};
    
    if (startDate || endDate) {
      dateQuery.date = {};
      if (startDate) dateQuery.date.$gte = new Date(startDate);
      if (endDate) dateQuery.date.$lte = new Date(endDate);
    }

    const stats = await Attendance.aggregate([
      { $match: dateQuery },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalRecords = await Attendance.countDocuments(dateQuery);

    res.status(200).json({
      success: true,
      data: {
        total: totalRecords,
        breakdown: stats,
        present: stats.find(s => s._id === 'present')?.count || 0,
        absent: stats.find(s => s._id === 'absent')?.count || 0,
        late: stats.find(s => s._id === 'late')?.count || 0,
        leave: stats.find(s => s._id === 'leave')?.count || 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTodayAttendance = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const attendance = await Attendance.find({
      date: { $gte: today, $lt: tomorrow }
    }).populate('student');

    res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
