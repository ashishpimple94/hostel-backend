const express = require('express');
const router = express.Router();
const {
  getNotices,
  getNotice,
  createNotice,
  updateNotice,
  deleteNotice
} = require('../controllers/noticeController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router
  .route('/')
  .get(getNotices)
  .post(authorize('admin', 'warden'), createNotice);

router
  .route('/:id')
  .get(getNotice)
  .put(authorize('admin', 'warden'), updateNotice)
  .delete(authorize('admin', 'warden'), deleteNotice);

module.exports = router;
