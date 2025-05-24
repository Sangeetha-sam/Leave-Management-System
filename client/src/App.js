import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import TeacherDashboard from './pages/TeacherDashboard';
import HODDashboard from './pages/HODDashboard';
import ApplyLeave from './pages/ApplyLeave';
import LeaveHistory from './pages/LeaveHistory';
import Notifications from './pages/Notifications';
import { getProfile } from './utils/api';
import './styles/global.css';
import Home from './pages/Home';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await getProfile();
        setUser(res.data);
      } catch {
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route path="/teacher/dashboard" element={user && user.role === 'teacher' ? <TeacherDashboard user={user} /> : <Navigate to="/login" />} />
        <Route path="/hod/dashboard" element={user && user.role === 'hod' ? <HODDashboard user={user} /> : <Navigate to="/login" />} />
        <Route path="/apply-leave" element={user && user.role === 'teacher' ? <ApplyLeave user={user} /> : <Navigate to="/login" />} />
        <Route path="/leave-history" element={user ? <LeaveHistory user={user} /> : <Navigate to="/login" />} />
        <Route path="/notifications" element={user ? <Notifications user={user} /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
