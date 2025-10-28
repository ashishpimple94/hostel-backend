const Fee = require('../models/Fee');
const Student = require('../models/Student');

exports.getFees = async (req, res) => {
  try {
    const { status, student, semester, year } = req.query;
    let query = {};

    // If user is a student, automatically filter by their student record
    if (req.user.role === 'student') {
      // Find student by user email
      const studentRecord = await Student.findOne({ email: req.user.email });
      if (studentRecord) {
        query.student = studentRecord._id;
      }
    } else {
      // For admin/accountant, allow filtering by student
      if (student) query.student = student;
    }

    if (status) query.status = status;
    if (semester) query.semester = semester;
    if (year) query.year = year;

    const fees = await Fee.find(query)
      .populate('student')
      .select('+transactionId +paymentMethod +paidDate')
      .sort('-createdAt');

    res.status(200).json({ success: true, count: fees.length, data: fees });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getFee = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id)
      .populate('student')
      .select('+transactionId +paymentMethod +paidDate');
    if (!fee) {
      return res.status(404).json({ success: false, message: 'Fee not found' });
    }
    res.status(200).json({ success: true, data: fee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createFee = async (req, res) => {
  try {
    req.body.createdBy = req.user.id;
    const fee = await Fee.create(req.body);
    
    // Update student's pending fees information
    await updateStudentPendingFees(req.body.student);
    
    res.status(201).json({ success: true, data: fee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateFee = async (req, res) => {
  try {
    const fee = await Fee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!fee) {
      return res.status(404).json({ success: false, message: 'Fee not found' });
    }
    
    // Update student's pending fees information
    await updateStudentPendingFees(fee.student);
    
    res.status(200).json({ success: true, data: fee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.payFee = async (req, res) => {
  try {
    const { paymentMethod, transactionId } = req.body;
    
    const fee = await Fee.findById(req.params.id);
    if (!fee) {
      return res.status(404).json({ success: false, message: 'Fee not found' });
    }

    fee.status = 'paid';
    fee.paidDate = new Date();
    fee.paymentMethod = paymentMethod;
    fee.transactionId = transactionId;
    await fee.save();
    
    // Update student's pending fees information
    await updateStudentPendingFees(fee.student);

    res.status(200).json({ success: true, data: fee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStudentFees = async (req, res) => {
  try {
    const fees = await Fee.find({ student: req.params.studentId })
      .select('+transactionId +paymentMethod +paidDate');
    res.status(200).json({ success: true, count: fees.length, data: fees });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteFee = async (req, res) => {
  try {
    const fee = await Fee.findByIdAndDelete(req.params.id);
    if (!fee) {
      return res.status(404).json({ success: false, message: 'Fee not found' });
    }
    
    // Update student's pending fees information
    await updateStudentPendingFees(fee.student);
    
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Helper function to update student's pending fees information
const updateStudentPendingFees = async (studentId) => {
  try {
    // Get all pending fees for the student
    const pendingFees = await Fee.find({
      student: studentId,
      status: { $in: ['pending', 'overdue'] }
    }).sort('dueDate');
    
    // Calculate total pending amount
    const totalPendingAmount = pendingFees.reduce((sum, fee) => sum + fee.amount, 0);
    
    // Get earliest and latest pending fee dates
    const hasPendingFees = pendingFees.length > 0;
    const pendingFeesFrom = hasPendingFees ? pendingFees[0].dueDate : null;
    const pendingFeesUntil = hasPendingFees ? pendingFees[pendingFees.length - 1].dueDate : null;
    
    // Update student record
    await Student.findByIdAndUpdate(studentId, {
      hasPendingFees,
      totalPendingAmount,
      pendingFeesFrom,
      pendingFeesUntil
    });
  } catch (error) {
    console.error('Error updating student pending fees:', error);
  }
};
