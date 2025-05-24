// src/components/Layout.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Layout = ({ user, children }) => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      <header style={styles.header}>
        <div style={styles.left}>
          <Link to="/dashboard" style={styles.logo}>Leave Management System</Link>
          <nav style={styles.nav}>
             <Link
  to={user?.role === 'teacher' ? '/teacher/dashboard' : user?.role === 'hod' ? '/hod/dashboard' : '/'}
  style={styles.navLink}
>
  Dashboard
</Link>
            <Link to="/notifications" style={styles.navLink}>Notifications</Link>
            {/* Show Apply Leave only if user is NOT HOD */}
            {user?.role !== 'hod' && (
              <Link to="/apply-leave" style={styles.navLink}>Apply Leave</Link>
            )}
          </nav>
        </div>
        <div style={styles.right}>
          {user?.profilePic ? (
            <img src={user.profilePic} alt="profile" style={styles.avatar} />
          ) : (
            <div style={styles.avatarPlaceholder}>{user?.name?.[0]?.toUpperCase() || '?'}</div>
          )}
          <span style={styles.username}>{user?.name}</span>
          <button onClick={logout} style={styles.logoutBtn}>Logout</button>
        </div>
      </header>
      <main style={styles.mainContent}>{children}</main>
    </>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#004d99',
    color: '#fff',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    fontWeight: 'bold',
    fontSize: '20px',
    color: '#fff',
    textDecoration: 'none',
    marginRight: '30px',
  },
  nav: {
    display: 'flex',
    gap: '20px',
  },
  navLink: {
    color: '#fff',
    textDecoration: 'none',
    fontWeight: '500',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: '50%',
    objectFit: 'cover',
  },
  avatarPlaceholder: {
    width: 35,
    height: 35,
    borderRadius: '50%',
    backgroundColor: '#666',
    color: '#fff',
    fontWeight: '700',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  username: {
    marginRight: '10px',
    fontWeight: '600',
  },
  logoutBtn: {
    backgroundColor: '#cc0000',
    border: 'none',
    color: 'white',
    padding: '6px 12px',
    cursor: 'pointer',
    borderRadius: '4px',
  },
  mainContent: {
    padding: '20px',
  },
};

export default Layout;

