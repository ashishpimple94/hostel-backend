const User = require('../models/User');
const Student = require('../models/Student');
const { sendTokenResponse } = require('../utils/jwt');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { email, password, role, firstName, lastName, phone, studentData } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    let user;

    // If registering as student, create student record first
    if (role === 'student') {
      // Generate student ID
      const studentCount = await Student.countDocuments();
      const studentId = `STU${String(studentCount + 1).padStart(5, '0')}`;

      // Create basic student record with minimal required fields
      const studentRecord = await Student.create({
        studentId,
        firstName: firstName || studentData?.firstName,
        lastName: lastName || studentData?.lastName,
        email,
        phone: phone || studentData?.phone || 'N/A',
        dateOfBirth: studentData?.dateOfBirth || new Date('2000-01-01'),
        gender: studentData?.gender || 'other',
        department: studentData?.department || 'Not Assigned',
        course: studentData?.course || 'Not Assigned',
        year: studentData?.year || 1,
        semester: studentData?.semester || 1,
        guardianName: studentData?.guardianName || 'To be updated',
        guardianPhone: studentData?.guardianPhone || 'To be updated',
        guardianRelation: studentData?.guardianRelation || 'To be updated',
        ...(studentData || {})
      });

      user = await User.create({
        email,
        password,
        role: 'student',
        studentId: studentRecord._id
      });
    } else {
      user = await User.create({ email, password, role });
    }

    sendTokenResponse(user, 201, res);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('studentId');

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    if (!(await user.comparePassword(req.body.currentPassword))) {
      return res.status(401).json({
        success: false,
        message: 'Password is incorrect'
      });
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
