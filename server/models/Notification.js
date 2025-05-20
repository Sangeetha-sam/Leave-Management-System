import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: String,
  read: { type: Boolean, default: false },
  type: String, // 'leave-status', 'substitution', 'reminder'
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Notification', notificationSchema);
