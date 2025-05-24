import React, { useEffect, useState } from 'react';
import { getDepartmentLeaves, updateLeaveStatus, getNotifications } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const HODDashboard = ({ user }) => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const fetchLeaves = async () => {
    try {
      const res = await getDepartmentLeaves();
      setLeaveRequests(res.data);
    } catch (err) {
      console.error('Failed to fetch leaves:', err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications();
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  useEffect(() => {
    fetchLeaves();
    fetchNotifications();
  }, []);

  const handleApproveReject = async (leaveId, decision) => {
    try {
      await updateLeaveStatus(leaveId, decision);
      setLeaveRequests((prev) => prev.filter((l) => l._id !== leaveId));
    } catch (err) {
      console.error('Failed to update leave status:', err);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Layout user={user}>
      <div className="hod-dashboard-container">
        <h1>HOD Dashboard - {user.department}</h1>
        <button className="logout-btn" onClick={logout}>Logout</button>

        <section className="leave-requests-section">
          <h2>Pending Leave Requests</h2>
          {leaveRequests.length === 0 ? (
            <p>No pending leave requests.</p>
          ) : (
            <table className="leave-requests-table">
              <thead>
                <tr>
                  <th>Teacher</th>
                  <th>Type</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Reason</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {leaveRequests.map((leave) => (
                  <tr key={leave._id}>
                    <td>{leave.teacherName}</td>
                    <td>{leave.leaveType}</td>
                    <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                    <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                    <td>{leave.reason}</td>
                    <td>
                      <button className="approve-btn" onClick={() => handleApproveReject(leave._id, 'Approved')}>Approve</button>
                      <button className="reject-btn" onClick={() => handleApproveReject(leave._id, 'Rejected')}>Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="notifications-section">
          <h2>Notifications ({notifications.filter((n) => !n.read).length})</h2>
          <ul className="notifications-list">
            {notifications.map((n) => (
              <li key={n._id} className={n.read ? "read" : "unread"}>
                {n.message} - <span className="notification-date">{new Date(n.date).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Layout>
  );
};

export default HODDashboard;
