const express = require('express');
const router = express.Router();
const {
  getComplaints,
  getComplaint,
  createComplaint,
  updateComplaint,
  assignComplaint,
  updateComplaintStatus,
  deleteComplaint
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router
  .route('/')
  .get(getComplaints)
  .post(createComplaint);

router
  .route('/:id')
  .get(getComplaint)
  .put(authorize('admin', 'warden', 'maintenance'), updateComplaint)
  .delete(authorize('admin', 'warden'), deleteComplaint);

router.put('/:id/assign', authorize('admin', 'warden'), assignComplaint);
router.put('/:id/status', authorize('admin', 'warden', 'maintenance'), updateComplaintStatus);

module.exports = router;
