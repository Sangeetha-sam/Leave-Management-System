import React from 'react';
import { Navigate } from 'react-router-dom';

const DashboardRedirect = ({ user }) => {
  if (!user) return <Navigate to="/login" />;
  if (user.role === 'teacher') return <Navigate to="/teacher/dashboard" />;
  if (user.role === 'hod') return <Navigate to="/hod/dashboard" />;
  return <Navigate to="/login" />;
};

export default DashboardRedirect;
