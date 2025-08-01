import express from 'express';
import {
  applyLeave,
  getLeaveHistory,
  getPendingLeaves,
  updateLeaveStatus,
  getDepartmentLeaves,
} from '../controllers/leaveController.js';
//import { protect } from '../middleware/authMiddleware.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply for leave
router.post('/', protect, applyLeave);

// Get current user's leave history
router.get('/my', protect, getLeaveHistory);

// // Get all pending leave requests (for HOD/Admin)
// router.get('/pending', protect, getPendingLeaves);

// // Update leave status (approve/reject)
// router.put('/:id/status', protect, updateLeaveStatus);

// Get all pending leave requests (for HOD/Admin)
router.get('/pending', protect, requireRole('hod'), getPendingLeaves);

// Update leave status (approve/reject)
router.put('/:id/status', protect, requireRole('hod'), updateLeaveStatus);

router.get('/department', protect, getDepartmentLeaves);

export default router;
