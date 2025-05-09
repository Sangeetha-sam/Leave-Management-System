import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Register.css'; // Create this CSS file

function Register() {
    const [registrationData, setRegistrationData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        department: '', // Optional for teachers
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setRegistrationData({ ...registrationData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (registrationData.password !== registrationData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            const response = await axios.post('/api/teachers/register', registrationData); // Backend registration endpoint
            setSuccessMessage(response.data.message || 'Registration successful. Please log in.');
            setError('');
            // Optionally, redirect to login after a short delay
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (error) {
            setError(error.response?.data?.message || 'Registration failed');
            setSuccessMessage('');
        }
    };

    return (
        <div className="register-container">
            <h2>Teacher Registration</h2>
            {error && <p className="error-message">{error}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" value={registrationData.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" value={registrationData.username} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" value={registrationData.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" value={registrationData.password} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input type="password" id="confirmPassword" name="confirmPassword" value={registrationData.confirmPassword} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="department">Department (Optional):</label>
                    <input type="text" id="department" name="department" value={registrationData.department} onChange={handleChange} />
                </div>
                <button type="submit" className="register-button">Register</button>
            </form>
            <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
    );
}

export default Register;