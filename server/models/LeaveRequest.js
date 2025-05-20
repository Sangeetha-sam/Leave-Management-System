import mongoose from 'mongoose';

const leaveRequestSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },

  leaveType: { 
    type: String, 
    enum: ['Casual Leave', 'Medical Leave', 'Academic Leave'], 
    required: true 
  },

  startDate: { 
    type: Date, 
    required: true 
  },
  
  endDate: { 
    type: Date, 
    required: true 
  },

  reason: { 
    type: String 
  },

  // substitutes: {
  //   // Map of slot -> substitute teacher ObjectId (or null)
  //   type: Map,
  //   of: { 
  //     type: mongoose.Schema.Types.ObjectId, 
  //     ref: 'Teacher', 
  //     default: null 
  //   },
  //   default: {}
  // },
  substitutes: {
    type: Map,
    of: String,  // <-- accept any string, no ObjectId casting
  },

  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },

  appliedAt: { 
    type: Date, 
    default: Date.now 
  },
});

const LeaveRequest = mongoose.model('LeaveRequest', leaveRequestSchema);
export default LeaveRequest;
