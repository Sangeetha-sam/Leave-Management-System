import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/global.css';

const Header = ({ user }) => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const goToDashboard = () => {
    if (user?.role === 'teacher') navigate('/teacher/dashboard');
    else if (user?.role === 'hod') navigate('/hod/dashboard');
  };

  return (
    <header className="app-header">
      <h1 className="app-title">Leave Management System</h1>
      <nav>
        <button onClick={() => navigate('/')}>Home</button>
        {user && <button onClick={goToDashboard}>Dashboard</button>}
        <button onClick={() => navigate('/notifications')}>Notifications</button>
        {user ? (
          <button onClick={logout}>Logout</button>
        ) : (
          <>
            <button onClick={() => navigate('/login')}>Login</button>
            <button onClick={() => navigate('/register')}>Register</button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
