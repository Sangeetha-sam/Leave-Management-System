import Notification from '../models/Notification.js';

// Get notifications for logged-in user
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark notification as read
export const markNotificationRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = await Notification.findOne({ _id: notificationId, user: req.user._id });
    if (!notification) return res.status(404).json({ message: 'Notification not found' });

    notification.read = true;
    await notification.save();

    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
