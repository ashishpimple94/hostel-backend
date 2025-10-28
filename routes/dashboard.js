const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getRoomOccupancyReport,
  getFeeCollectionReport
} = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/stats', getDashboardStats);
router.get('/room-occupancy', authorize('admin', 'warden'), getRoomOccupancyReport);
router.get('/fee-collection', authorize('admin', 'accountant'), getFeeCollectionReport);

module.exports = router;
