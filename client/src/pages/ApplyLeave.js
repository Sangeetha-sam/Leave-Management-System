// src/pages/ApplyLeave.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import './ApplyLeave.css';

axios.defaults.baseURL = 'http://localhost:5000';

const timeSlots = [
  '9:00 - 9:55',
  '9:55 - 10:50',
  '11:05 - 12:00',
  '12:00 - 12:55',
  '1:45 - 2:40',
  '2:40 - 3:35',
  '3:35 - 4:30',
];

const ApplyLeave = ({ user }) => {
  // ... (your existing state and handlers stay the same)
  // omitted here for brevity, use the exact same logic from your code

  // Paste your entire ApplyLeave component code here,
  // but wrap the return JSX inside <Layout user={user}> ... </Layout>

  // Example:
  // return (
  //   <Layout user={user}>
  //     <div className="apply-leave-container">
  //       ... rest of your form JSX
  //     </div>
  //   </Layout>
  // );

  // For clarity, I'll just paste your JSX wrapped:
  
  // (Replace all your return(...) JSX with below)

  const [leaveType, setLeaveType] = useState('Casual Leave');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [totalDays, setTotalDays] = useState(0);
  const [teachers, setTeachers] = useState([]);
  const [leaveDates, setLeaveDates] = useState([]);
  const [substitutePlan, setSubstitutePlan] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/users/teachers')
      .then(res => setTeachers(res.data))
      .catch(err => console.error('Error fetching teachers', err));
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const validDates = [];

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const day = new Date(d);
        if (day.getDay() !== 0) {
          validDates.push(new Date(day));
        }
      }

      setLeaveDates(validDates);
      setTotalDays(validDates.length);
    } else {
      setLeaveDates([]);
      setTotalDays(0);
    }
  }, [startDate, endDate]);

  const handleAddSlot = () => {
    if (!leaveDates.length) {
      alert('Please select valid leave dates first.');
      return;
    }

    setSubstitutePlan(prev => [
      ...prev,
      {
        date: '',
        section: '',
        timeSlot: '',
        substituteTeacherId: '',
      },
    ]);
  };

  const handleRemoveSlot = (index) => {
    setSubstitutePlan(prev => prev.filter((_, i) => i !== index));
  };

  const handleSlotChange = (index, field, value) => {
    const updated = [...substitutePlan];
    updated[index][field] = value;

    if (field === 'substituteTeacherId') {
      const current = updated[index];
      const isConflict = updated.some((entry, i) =>
        i !== index &&
        entry.date === current.date &&
        entry.timeSlot === current.timeSlot &&
        entry.substituteTeacherId === value
      );
      if (isConflict) {
        alert('This teacher is already assigned to another slot at the same time!');
        return;
      }
    }

    setSubstitutePlan(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first.');
      return;
    }

    const payload = {
      leaveType,
      startDate,
      endDate,
      reason,
      substitutes: substitutePlan,
    };

    try {
      await axios.post('/api/leaves', payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Leave request submitted!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Leave submission failed', error);
      alert(error.response?.data?.message || 'Submission failed.');
    }
  };

  const handleGoBack = () => {
    navigate('/dashboard');
  };

  return (
    <Layout user={user}>
      <div className="apply-leave-container">
        <h2>Apply for Leave</h2>
        <form onSubmit={handleSubmit} className="leave-form">
          <label>
            Leave Type*:
            <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)} required>
              <option>Casual Leave</option>
              <option>Medical Leave</option>
              <option>Academic Leave</option>
            </select>
          </label>

          <label>
            Start Date*:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </label>

          <label>
            End Date*:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              min={startDate}
            />
          </label>

          <p>
            <strong>Total Leave Days (excluding Sunday):</strong> {totalDays}
          </p>

          <label>
            Reason (optional):
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Optional"
            />
          </label>

          <hr />
          <h3>Suggest Substitute Teachers for Each Slot</h3>
          {substitutePlan.map((entry, index) => (
            <div key={index} className="slot-entry">
              <label>
                Date:
                <select
                  value={entry.date}
                  onChange={(e) => handleSlotChange(index, 'date', e.target.value)}
                  required
                >
                  <option value="">Select Date</option>
                  {leaveDates.map((date, i) => (
                    <option key={i} value={date.toISOString().split('T')[0]}>
                      {date.toDateString()}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Section/Class:
                <input
                  type="text"
                  placeholder="e.g. 10A"
                  value={entry.section}
                  onChange={(e) => handleSlotChange(index, 'section', e.target.value)}
                  required
                />
              </label>

              <label>
                Time Slot:
                <select
                  value={entry.timeSlot}
                  onChange={(e) => handleSlotChange(index, 'timeSlot', e.target.value)}
                  required
                >
                  <option value="">Select</option>
                  {timeSlots.map((slot, i) => (
                    <option key={i} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Substitute Teacher:
                <select
                  value={entry.substituteTeacherId}
                  onChange={(e) => handleSlotChange(index, 'substituteTeacherId', e.target.value)}
                  required
                >
                  <option value="">-- None --</option>
                  {teachers.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </label>

              <button
                type="button"
                onClick={() => handleRemoveSlot(index)}
                className="remove-btn"
              >
                Remove Slot
              </button>
            </div>
          ))}

          <button type="button" onClick={handleAddSlot} className="add-slot-btn">
            Add Class Slot
          </button>

          <div style={{ marginTop: '20px' }}>
            <button type="submit" className="submit-btn">
              Submit Leave Request
            </button>
            <button type="button" className="go-back-btn" onClick={handleGoBack}>
              Go Back
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ApplyLeave;
