const express = require('express');
const router = express.Router();
const {
  getRooms,
  getAvailableRooms,
  getRoom,
  createRoom,
  updateRoom,
  allocateRoom,
  deallocateRoom,
  deleteRoom
} = require('../controllers/roomController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/available', getAvailableRooms);

router
  .route('/')
  .get(getRooms)
  .post(authorize('admin', 'warden'), createRoom);

router
  .route('/:id')
  .get(getRoom)
  .put(authorize('admin', 'warden'), updateRoom)
  .delete(authorize('admin'), deleteRoom);

router.post('/:id/allocate', authorize('admin', 'warden'), allocateRoom);
router.post('/:id/deallocate', authorize('admin', 'warden'), deallocateRoom);

module.exports = router;
