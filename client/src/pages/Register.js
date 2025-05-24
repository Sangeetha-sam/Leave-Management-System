import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../utils/api';

const Register = ({ setUser }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'teacher',
    department: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await registerUser(formData);
      localStorage.setItem('token', res.data.token);
      setUser(res.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      {error && <p className="error-msg">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input name="name" value={formData.name} onChange={handleChange} required />

        <label>Email</label>
        <input name="email" type="email" value={formData.email} onChange={handleChange} required />

        <label>Password</label>
        <input name="password" type="password" value={formData.password} onChange={handleChange} required />

        <label>Role</label>
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="teacher">Teacher</option>
          <option value="hod">HOD</option>
        </select>

        <label>Department</label>
        <input name="department" value={formData.department} onChange={handleChange} required />

        <button type="submit">Register</button>
      </form>
      <p>
        Have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default Register;
