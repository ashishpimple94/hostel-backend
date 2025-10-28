const express = require('express');
const router = express.Router();
const {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentLedger
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router
  .route('/')
  .get(authorize('admin', 'warden', 'accountant'), getStudents)
  .post(authorize('admin', 'warden'), createStudent);

router
  .route('/:id')
  .get(getStudent)
  .put(authorize('admin', 'warden'), updateStudent)
  .delete(authorize('admin'), deleteStudent);

router.get('/:id/ledger', getStudentLedger);

module.exports = router;
