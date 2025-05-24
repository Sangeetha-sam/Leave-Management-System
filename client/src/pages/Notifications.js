import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { getNotifications, markNotificationAsRead, deleteNotification } from '../utils/api';

const Notifications = ({ user }) => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications();
      setNotifications(res.data);
    } catch (error) {
      console.error('Failed to load notifications', error);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error('Failed to mark as read', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (error) {
      console.error('Failed to delete notification', error);
    }
  };

  return (
    <Layout user={user}>
      <button onClick={() => navigate('/')}>← Go Back</button>
      <h1>Notifications</h1>
      {notifications.length === 0 ? (
        <p>No notifications found.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {notifications.map((notification) => (
            <li
              key={notification._id}
              style={{
                marginBottom: '10px',
                padding: '10px',
                border: '1px solid #ccc',
                backgroundColor: notification.read ? '#f0f0f0' : '#fff',
              }}
            >
              <p>{notification.message}</p>
              <small>{new Date(notification.date).toLocaleString()}</small>
              <div style={{ marginTop: '5px' }}>
                {!notification.read && (
                  <button
                    onClick={() => handleMarkAsRead(notification._id)}
                    style={{ marginRight: '10px' }}
                  >
                    Mark as Read
                  </button>
                )}
                <button onClick={() => handleDelete(notification._id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Layout>
  );
};

export default Notifications;
