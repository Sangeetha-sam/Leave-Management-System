import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyLeaves, getNotifications } from '../utils/api';
import Layout from '../components/Layout'; // Use Layout instead of Header

const TeacherDashboard = ({ user }) => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await getMyLeaves();
        setLeaveRequests(res.data);
      } catch {}
    };
    fetchLeaves();

    const fetchNotifications = async () => {
      try {
        const res = await getNotifications();
        setNotifications(res.data);
      } catch {}
    };
    fetchNotifications();
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Layout user={user}> {/* Wrapping entire content in Layout */}
      <div className="dashboard-container">
        <h1>Welcome, {user.name}</h1>
        <button onClick={logout}>Logout</button>

        <h2 className="section-title">Your Leave Requests</h2>
        {leaveRequests.length === 0 ? (
          <p>No leave requests found.</p>
        ) : (
          <table className="leave-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>From</th>
                <th>To</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.map((leave) => (
                <tr key={leave._id}>
                  <td>{leave.leaveType}</td>
                  <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                  <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`status ${leave.status}`}>{leave.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <h2 className="section-title">Quick Links</h2>
        <ul className="quick-links">
          <li><Link to="/apply-leave">Apply Leave</Link></li>
          <li><Link to="/leave-history">Leave History</Link></li>
          <li><Link to="/notifications">
            Notifications ({notifications.filter((n) => !n.read).length})
          </Link></li>
        </ul>
      </div>
    </Layout>
  );
};

export default TeacherDashboard;
