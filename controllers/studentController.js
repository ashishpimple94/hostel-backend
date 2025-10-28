const Student = require('../models/Student');
const User = require('../models/User');

// @desc    Get all students
// @route   GET /api/students
// @access  Private (Admin/Warden)
exports.getStudents = async (req, res) => {
  try {
    const { status, department, year } = req.query;
    let query = {};

    if (status) query.status = status;
    if (department) query.department = department;
    if (year) query.year = year;

    const students = await Student.find(query).populate('roomNo');

    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Private
exports.getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('roomNo');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new student
// @route   POST /api/students
// @access  Private (Admin/Warden)
exports.createStudent = async (req, res) => {
  try {
    const student = await Student.create(req.body);

    // Create user account for student
    await User.create({
      email: req.body.email,
      password: req.body.password || 'student123',
      role: 'student',
      studentId: student._id
    });

    res.status(201).json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private (Admin/Warden)
exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private (Admin)
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Also delete user account
    await User.findOneAndDelete({ studentId: student._id });

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get student ledger (complete account statement)
// @route   GET /api/students/:id/ledger
// @access  Private
exports.getStudentLedger = async (req, res) => {
  try {
    const Fee = require('../models/Fee');
    const student = await Student.findById(req.params.id).populate('roomNo');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Get all fees for the student
    const fees = await Fee.find({ student: req.params.id }).sort('dueDate');

    // Calculate ledger entries with running balance
    let runningBalance = 0;
    const ledgerEntries = fees.map(fee => {
      runningBalance += fee.amount;
      const entry = {
        _id: fee._id,
        date: fee.dueDate,
        type: fee.feeType,
        description: `${fee.feeType.charAt(0).toUpperCase() + fee.feeType.slice(1)} Fee - Semester ${fee.semester}, Year ${fee.year}`,
        debit: fee.amount,
        credit: 0,
        balance: runningBalance,
        status: fee.status,
        paidDate: fee.paidDate,
        paymentMethod: fee.paymentMethod,
        transactionId: fee.transactionId,
        semester: fee.semester,
        year: fee.year
      };

      // If paid, add payment entry
      if (fee.status === 'paid' && fee.paidDate) {
        runningBalance -= fee.amount;
      }

      return entry;
    });

    // Create complete ledger with payment entries
    const completeLedger = [];
    fees.forEach(fee => {
      // Add fee entry
      const semesterInfo = fee.semester ? ` - Semester ${fee.semester}` : '';
      const yearInfo = fee.year ? `, Year ${fee.year}` : '';
      completeLedger.push({
        _id: fee._id + '_fee',
        date: fee.dueDate,
        type: 'Fee',
        description: `${fee.feeType.charAt(0).toUpperCase() + fee.feeType.slice(1)} Fee${semesterInfo}${yearInfo}`,
        debit: fee.amount,
        credit: 0,
        status: fee.status,
        paidDate: fee.paidDate || null,
        transactionId: fee.transactionId || null,
        paymentMethod: fee.paymentMethod || null,
        semester: fee.semester || null,
        year: fee.year || null,
        feeId: fee._id
      });

      // Add payment entry if paid
      if (fee.status === 'paid' && fee.paidDate) {
        completeLedger.push({
          _id: fee._id + '_payment',
          date: fee.paidDate,
          type: 'Payment',
          description: `Payment for ${fee.feeType} fee via ${fee.paymentMethod || 'N/A'}`,
          debit: 0,
          credit: fee.amount,
          status: 'paid',
          transactionId: fee.transactionId,
          paymentMethod: fee.paymentMethod,
          feeId: fee._id
        });
      }
    });

    // Sort by date
    completeLedger.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Calculate running balance
    let balance = 0;
    completeLedger.forEach(entry => {
      balance += entry.debit - entry.credit;
      entry.balance = balance;
    });

    // Calculate stay duration
    const admissionDate = new Date(student.enrollmentDate);
    const today = new Date();
    const stayDurationMs = today - admissionDate;
    const stayDurationDays = Math.floor(stayDurationMs / (1000 * 60 * 60 * 24));
    const stayDurationMonths = Math.floor(stayDurationDays / 30);

    // Calculate deposit (security deposit fees)
    const securityDeposits = fees.filter(f => f.feeType === 'security');
    const totalDeposit = securityDeposits.reduce((sum, fee) => sum + fee.amount, 0);
    const depositPaid = securityDeposits.filter(f => f.status === 'paid').reduce((sum, fee) => sum + fee.amount, 0);
    
    // Calculate refundable amount (paid security deposits)
    const refundableAmount = depositPaid;

    // Calculate summary
    const totalFees = fees.reduce((sum, fee) => sum + fee.amount, 0);
    const totalPaid = fees.filter(f => f.status === 'paid').reduce((sum, fee) => sum + fee.amount, 0);
    const totalPending = fees.filter(f => f.status !== 'paid').reduce((sum, fee) => sum + fee.amount, 0);
    
    // Total due considering refundable deposit
    const totalDue = balance - refundableAmount;

    const summary = {
      admissionDate: student.enrollmentDate,
      stayDurationDays,
      stayDurationMonths,
      totalFees,
      totalPaid,
      totalPending,
      totalDeposit,
      depositPaid,
      refundableAmount,
      currentBalance: balance,
      totalDue,
      totalTransactions: completeLedger.length
    };

    res.status(200).json({
      success: true,
      data: {
        student: {
          _id: student._id,
          studentId: student.studentId,
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
          department: student.department,
          course: student.course,
          year: student.year,
          semester: student.semester,
          roomNo: student.roomNo,
          enrollmentDate: student.enrollmentDate
        },
        ledger: completeLedger,
        summary
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
