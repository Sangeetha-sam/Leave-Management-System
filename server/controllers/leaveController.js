import LeaveRequest from '../models/LeaveRequest.js'; // Use this and ONLY this
import Teacher from '../models/Teacher.js';  // Adjust the relative path as needed
import mongoose from 'mongoose';

// Create a leave request
export const applyLeave = async (req, res) => {
  try {
    const {
      leaveType,
      startDate,
      endDate,
      reason,
      substitutes = {},
    } = req.body;

    // Use substitutes as is, no ObjectId conversion since schema expects strings
    // Also use authenticated user ID, NOT dummy
    const newLeaveRequest = new LeaveRequest({
      userId: req.user._id,
      leaveType,
      startDate,
      endDate,
      reason,
      substitutes,
    });

    await newLeaveRequest.save();

    res.status(201).json({ message: 'Leave request created successfully', leaveRequest: newLeaveRequest });
  } catch (error) {
    console.error('Error creating leave request:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// Get leave history of logged-in user
export const getLeaveHistory = async (req, res) => {
  try {
    const leaves = await LeaveRequest.find({ userId: req.user._id }).lean();

    // Optionally, you can populate substitute teacher names manually here
    // since substitutes is a Map, populate won't work automatically.

    res.json(leaves);
  } catch (err) {
    console.error('Error getting leave history:', err);
    res.status(500).json({ message: 'Error getting leave history' });
  }
};

// Get all pending leaves (for admin/HOD)
export const getPendingLeaves = async (req, res) => {
  try {
    const leaves = await LeaveRequest.find({ status: 'Pending' }).lean();

    res.json(leaves);
  } catch (err) {
    console.error('Error getting pending leaves:', err);
    res.status(500).json({ message: 'Error getting pending leaves' });
  }
};

// Update leave status by ID
export const updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    const updated = await LeaveRequest.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Leave request not found.' });
    }

    res.json(updated);
  } catch (err) {
    console.error('Error updating leave status:', err);
    res.status(500).json({ message: 'Error updating leave status' });
  }
};
