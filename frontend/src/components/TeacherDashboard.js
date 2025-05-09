import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TeacherDashboard.css';

function TeacherDashboard() {
    const [leaveBalance, setLeaveBalance] = useState(0);
    const [pastLeaves, setPastLeaves] = useState([]);
    const [upcomingDuties, setUpcomingDuties] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await axios.get('/api/teachers/dashboard', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setLeaveBalance(response.data.leaveBalance);
                    setPastLeaves(response.data.pastLeaves);
                    setUpcomingDuties(response.data.upcomingDuties);
                } catch (error) {
                    console.error('Failed to fetch dashboard data:', error.response?.data?.message || error.message);
                    localStorage.removeItem('token'); // Clear invalid token
                    navigate('/login'); // Redirect to login
                }
            } else {
                navigate('/login');
            }
        };

        fetchDashboardData();
    }, [navigate]);

    const handleApplyLeaveClick = () => {
        navigate('/teacher/apply-leave');
    };

    return (
        <div className="teacher-dashboard-container">
            <h2>Welcome, Teacher!</h2>
            <div className="dashboard-section">
                <h3>Leave Balance</h3>
                <p>{leaveBalance} days</p>
            </div>
            <div className="dashboard-section">
                <h3>Past Leave Applications</h3>
                {pastLeaves.length > 0 ? (
                    <ul>
                        {pastLeaves.map((leave) => (
                            <li key={leave._id}>
                                {leave.leaveType} - {new Date(leave.startDate).toLocaleDateString()} to{' '}
                                {new Date(leave.endDate).toLocaleDateString()} ({leave.status})
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No past leave applications.</p>
                )}
            </div>
            <div className="dashboard-section">
                <h3>Upcoming Assigned Duties</h3>
                {upcomingDuties.length > 0 ? (
                    <ul>
                        {upcomingDuties.map((duty) => (
                            <li key={duty._id}>
                                {new Date(duty.date).toLocaleDateString()} - {duty.class} {duty.section} ({duty.timeSlot}) {duty.subject ? `- ${duty.subject}` : ''} (Covering for {duty.absentTeacher})
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No upcoming assigned duties.</p>
                )}
            </div>
            <button onClick={handleApplyLeaveClick}>Apply for Leave</button>
        </div>
    );
}

export default TeacherDashboard;