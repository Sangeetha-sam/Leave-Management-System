import Notification from '../models/Notification.js';

export const sendNotification = async (userId, message) => {
  try {
    const notification = new Notification({ user: userId, message });
    await notification.save();
  } catch (err) {
    console.error('Notification error:', err);
  }
};
