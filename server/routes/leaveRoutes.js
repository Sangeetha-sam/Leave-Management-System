import express from 'express';
import {
  applyLeave,
  getLeaveHistory,
  getPendingLeaves,
  updateLeaveStatus,
} from '../controllers/leaveController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply for leave
router.post('/', protect, applyLeave);

// Get current user's leave history
router.get('/my', protect, getLeaveHistory);

// Get all pending leave requests (for HOD/Admin)
router.get('/pending', protect, getPendingLeaves);

// Update leave status (approve/reject)
router.put('/:id/status', protect, updateLeaveStatus);

export default router;
