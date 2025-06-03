import LeaveRequest from '../models/LeaveRequest.js'; // Use this and ONLY this
import Teacher from '../models/Teacher.js';  // Adjust the relative path as needed
import mongoose from 'mongoose';
import User from '../models/User.js';
import Leave from '../models/Leave.js';
import { sendNotification } from './notificationController.js';

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
    // Notify HODs of the teacher's department about the new leave request, including substitutes
    const hods = await User.find({ department: req.user.department, role: 'hod' });

    let substituteSummary = 'Substitute Plan:\n';
    if (substitutes.length === 0) {
      substituteSummary += 'No substitutes specified.';
    } else {
      for (const slot of substitutes) {
        const subTeacher = await User.findById(slot.substituteTeacherId).lean();
        substituteSummary += `- Date: ${slot.date}, Section: ${slot.section}, Time: ${slot.timeSlot}, Substitute: ${subTeacher?.name || 'Unknown'}\n`;
      }
    }

    for (const hod of hods) {
      await sendNotification(
        hod._id,
        `📋 New Leave Request from ${req.user.name} (${leaveType})
    🗓️ ${startDate} to ${endDate}
    Reason: ${reason}

    ${substituteSummary}`
      );
    }

    // Notify substitute teachers
    const uniqueAssignments = new Set();

    for (const slot of substitutes) {
      const key = `${slot.substituteTeacherId}-${slot.section}-${slot.timeSlot}`;
      if (!uniqueAssignments.has(key) && slot.substituteTeacherId) {
        uniqueAssignments.add(key);

        const substituteUser = await User.findById(slot.substituteTeacherId);
        if (substituteUser) {
          await sendNotification(
            substituteUser._id,
            `You have been assigned as a substitute teacher on ${slot.date} for section ${slot.section} during ${slot.timeSlot}.`
          );
        }
      }
    }


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

// // Get all pending leaves (for admin/HOD)
// export const getPendingLeaves = async (req, res) => {
//   try {
//     const leaves = await LeaveRequest.find({ status: 'Pending' }).lean();

//     res.json(leaves);
//   } catch (err) {
//     console.error('Error getting pending leaves:', err);
//     res.status(500).json({ message: 'Error getting pending leaves' });
//   }
// };

// // Update leave status by ID
// export const updateLeaveStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
//       return res.status(400).json({ message: 'Invalid status value.' });
//     }

//     const updated = await LeaveRequest.findByIdAndUpdate(id, { status }, { new: true });
//     if (!updated) {
//       return res.status(404).json({ message: 'Leave request not found.' });
//     }

//     res.json(updated);
//   } catch (err) {
//     console.error('Error updating leave status:', err);
//     res.status(500).json({ message: 'Error updating leave status' });
//   }
// };
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
// export const updateLeaveStatus = async (req, res) => {
//   try {
//     console.log('User making request:', req.user);
//     console.log('User role:', req.user.role);

//     const { id } = req.params;
//     const { status } = req.body;

//     if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
//       return res.status(400).json({ message: 'Invalid status value.' });
//     }

//     const updated = await LeaveRequest.findByIdAndUpdate(id, { status }, { new: true });
//     if (!updated) {
//       return res.status(404).json({ message: 'Leave request not found.' });
//     }

//     res.json(updated);
//   } catch (err) {
//     console.error('Error updating leave status:', err);
//     res.status(500).json({ message: 'Error updating leave status' });
//   }
// };
// controllers/leaveController.js
// Update leave status by ID
export const updateLeaveStatus = async (req, res) => {
  try {
    const leaveId = req.params.id;
    const { status } = req.body;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // Fetch the leave request
    const leave = await Leave.findById(leaveId);
    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    // Update only status, do NOT overwrite substitutes or other fields
    leave.status = status;

    // Save
    await leave.save({ validateBeforeSave: false });

// Notify the requesting teacher about the status update
    const teacher = await User.findById(leave.userId);
    if (teacher) {
      await sendNotification(
        teacher._id,
        `Your leave request from ${leave.startDate} to ${leave.endDate} has been ${status.toLowerCase()}.`
      );
    }

    res.json({ message: 'Leave status updated', leave });
  } catch (error) {
    console.error('Error updating leave status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



// server/controllers/leaveController.js
 // Make sure this is imported

export const getDepartmentLeaves = async (req, res) => {
  try {
    const department = req.user?.department;
    if (!department) {
      return res.status(400).json({ message: 'No department found in user data' });
    }

    // Use LeaveRequest model here:
    const leaves = await LeaveRequest.find({ status: 'Pending' }).populate('userId').lean();

    // Filter leaves by department of the user (since leave requests have userId ref, 
    // and department is in user document)
    const filteredLeaves = leaves
    .filter((leave) => leave.userId?.department === department)
    .map((leave) => ({
      ...leave,
      teacherName: leave.userId?.name || 'Unknown',
    }));

  res.json(filteredLeaves);

  } catch (error) {
    console.error('Error in getDepartmentLeaves:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
