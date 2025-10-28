const express = require('express');
const router = express.Router();
const {
  getAttendance,
  markAttendance,
  updateAttendance,
  getStudentAttendance,
  markBulkAttendance,
  getAttendanceStats,
  getTodayAttendance
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router
  .route('/')
  .get(authorize('admin', 'warden'), getAttendance)
  .post(authorize('admin', 'warden'), markAttendance);

// Specific routes must come before parameterized routes
router.post('/bulk', authorize('admin', 'warden'), markBulkAttendance);
router.get('/stats', authorize('admin', 'warden'), getAttendanceStats);
router.get('/today', authorize('admin', 'warden'), getTodayAttendance);
router.get('/student/:studentId', getStudentAttendance);

// Parameterized route at the end
router.put('/:id', authorize('admin', 'warden'), updateAttendance);

module.exports = router;
