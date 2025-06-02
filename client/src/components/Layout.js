// src/components/Layout.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getNotifications } from '../utils/api';
import { FiBell } from 'react-icons/fi'; // Bell icon from react-icons

const Layout = ({ user, children }) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await getNotifications();
        setNotifications(res.data);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      }
    };
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      <header className="header">
        <div className="left">
          <Link to="/dashboard" className="logo">Leave Management System</Link>
          <nav className="nav">
          {user && (
            <>
              <Link
                to={
                  user.role === 'teacher'
                    ? '/teacher/dashboard'
                    : user.role === 'hod'
                    ? '/hod/dashboard'
                    : '/'
                }
                className="nav-link"
              >
                Dashboard
              </Link>

              {user.role !== 'hod' && (
                <Link to="/apply-leave" className="nav-link">Apply Leave</Link>
              )}
            </>
          )}
        </nav>
        </div>

        <div className="right">
          {user ? (
            <>
              {/* Notification Bell */}
              <div className="notification-wrapper" onClick={() => navigate('/notifications')}>
                <FiBell className="bell-icon" />
                {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
              </div>

              {user.profilePic ? (
                <img src={user.profilePic} alt="profile" className="avatar" />
              ) : (
                <div className="avatar-placeholder">
                  {user.name?.[0]?.toUpperCase() || '?'}
                </div>
              )}
              <span className="username">{user.name}</span>
              <button onClick={logout} className="logout-btn">Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')}>Login</button>
              <button onClick={() => navigate('/register')}>Register</button>
            </>
          )}
        </div>
      </header>
      <main className="main-content">{children}</main>
    </>
  );
};

export default Layout;