import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import TeacherLogin from './components/TeacherLogin';
import Register from './components/Register';
import TeacherDashboard from './components/TeacherDashboard';
import LeaveApplicationForm from './components/LeaveApplicationForm';
import AdminDashboard from './components/AdminDashboard'; // If you have it
import SubstituteNotification from './components/SubstituteNotification'; // If you have it
import './App.css';

function App() {
    return (
        <Router>
            <div className="app-container">
                <nav>
                    <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
                </nav>
                <Routes>
                    <Route path="/" element={<TeacherLogin />} /> {/* Default to login */}
                    <Route path="/login" element={<TeacherLogin />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
                    <Route path="/teacher/apply-leave" element={<LeaveApplicationForm />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} /> {/* If you have it */}
                    <Route path="/substitute/notification" element={<SubstituteNotification />} /> {/* If you have it */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;