// routes/notificationRoutes.js
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Notification from '../models/Notification.js';

const router = express.Router();

// GET all notifications for the logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ date: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get notifications' });
  }
});

// PUT: Mark notification as read
router.put('/:id/read', protect, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.read = true;
    await notification.save();
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update notification' });
  }
});

// DELETE: Delete a notification
router.delete('/:id', protect, async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete notification' });
  }
});

export default router;
