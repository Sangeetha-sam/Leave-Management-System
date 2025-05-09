import React, { useState, useEffect } from 'react';
    import { useNavigate } from 'react-router-dom';
    import axios from 'axios';
    import './LeaveApplicationForm.css';

    function LeaveApplicationForm() {
        const [leaveTypes] = useState(['Casual Leave', 'Medical Leave', 'Academic Leave']);
        const [formData, setFormData] = useState({
            leaveType: leaveTypes[0],
            startDate: '',
            endDate: '',
            reason: '',
            substituteSuggestions: [],
            attachments: [],
        });
        const [suggestedSubstitute, setSuggestedSubstitute] = useState({
            teacher: '',
            class: '',
            section: '',
            timeSlot: '',
            subject: '',
        });
        const [teachersList, setTeachersList] = useState([]);
        const [submissionMessage, setSubmissionMessage] = useState('');
        const [submissionError, setSubmissionError] = useState('');
        const navigate = useNavigate();

        useEffect(() => {
            const fetchTeachers = async () => {
                const token = localStorage.getItem('token');
                if (token) {
                    try {
                        const response = await axios.get('/api/teachers', {
                            headers: { Authorization: `Bearer ${token}` },
                        });
                        setTeachersList(response.data);
                    } catch (error) {
                        console.error('Failed to fetch teachers:', error.response?.data?.message || error.message);
                        // Handle error appropriately (e.g., redirect or display message)
                    }
                } else {
                    navigate('/login');
                }
            };
            fetchTeachers();
        }, [navigate]);

        const handleChange = (e) => {
            const { name, value, type, files } = e.target;
            setFormData((prevData) => ({
                ...prevData,
                [name]: type === 'file' ? files : value,
            }));
        };

        const handleAddSubstitute = () => {
            if (suggestedSubstitute.teacher && suggestedSubstitute.class && suggestedSubstitute.section && suggestedSubstitute.timeSlot) {
                const teacherName = teachersList.find(t => t._id === suggestedSubstitute.teacher)?.name || 'Unknown';
                setFormData((prevData) => ({
                    ...prevData,
                    substituteSuggestions: [
                        ...prevData.substituteSuggestions,
                        { ...suggestedSubstitute, teacherName }, // Include teacher name for display
                    ],
                }));
                setSuggestedSubstitute({ teacher: '', class: '', section: '', timeSlot: '', subject: '' });
            } else {
                alert('Please fill all substitute suggestion fields.');
            }
        };

        const handleRemoveSubstitute = (index) => {
            setFormData((prevData) => ({
                ...prevData,
                substituteSuggestions: prevData.substituteSuggestions.filter((_, i) => i !== index),
            }));
        };

        const handleSubstituteChange = (e) => {
            setSuggestedSubstitute({ ...suggestedSubstitute, [e.target.name]: e.target.value });
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const formDataToSend = new FormData();
                    for (const key in formData) {
                        if (key === 'attachments' && formData.attachments.length > 0) {
                            for (let i = 0; i < formData.attachments.length; i++) {
                                formDataToSend.append('attachments', formData.attachments[i]);
                            }
                        } else if (key === 'substituteSuggestions') {
                            formDataToSend.append('substituteSuggestions', JSON.stringify(formData.substituteSuggestions));
                        } else {
                            formDataToSend.append(key, formData[key]);
                        }
                    }

                    const response = await axios.post('/api/leaves/apply', formDataToSend, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data', // Important for file uploads
                        },
                    });

                    setSubmissionMessage(response.data.message);
                    setSubmissionError('');
                    setFormData({
                        leaveType: leaveTypes[0],
                        startDate: '',
                        endDate: '',
                        reason: '',
                        substituteSuggestions: [],
                        attachments: [],
                    });
                    setSuggestedSubstitute({ teacher: '', class: '', section: '', timeSlot: '', subject: '' });
                } catch (error) {
                    setSubmissionError(error.response?.data?.message || 'Failed to submit leave application.');
                    setSubmissionMessage('');
                }
            } else {
                navigate('/login');
            }
        };

        const calculateLeaveDays = () => {
            if (formData.startDate && formData.endDate) {
                const start = new Date(formData.startDate);
                const end = new Date(formData.endDate);
                const timeDiff = Math.abs(end.getTime() - start.getTime());
                return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
            }
            return 0;
        };

        return (
            <div className="leave-application-container">
                <h2>Apply for Leave</h2>
                {submissionMessage && <p className="success-message">{submissionMessage}</p>}
                {submissionError && <p className="error-message">{submissionError}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="leaveType">Leave Type:</label>
                        <select
                            id="leaveType"
                            name="leaveType"
                            value={formData.leaveType}
                            onChange={handleChange}
                        >
                            {leaveTypes.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="startDate">Start Date:</label>
                        <input
                            type="date"
                            id="startDate"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="endDate">End Date:</label>
                        <input
                            type="date"
                            id="endDate"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Number of Leave Days:</label>
                        <p>{calculateLeaveDays()}</p>
                    </div>
                    <div className="form-group">
                        <label htmlFor="reason">Reason for Leave (Optional):</label>
                        <textarea
                            id="reason"
                            name="reason"
                            value={formData.reason}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="attachments">Supporting Documents (Optional):</label>
                        <input
                            type="file"
                            id="attachments"
                            name="attachments"
                            onChange={handleChange}
                            multiple
                        />
                    </div>

                    <h3>Suggest Substitute Teacher (Optional)</h3>
                    {formData.substituteSuggestions.length > 0 && (
                        <div className="substitute-suggestions-list">
                            <h4>Suggested Substitutes:</h4>
                            <ul>
                                {formData.substituteSuggestions.map((substitute, index) => (
                                    <li key={index}>
                                        {substitute.teacherName} - Class: {substitute.class}, Section: {substitute.section}, Time Slot: {substitute.timeSlot}, Subject: {substitute.subject}
                                        <button type="button" onClick={() => handleRemoveSubstitute(index)}>Remove</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="substitute-suggestion">
                        <div className="form-group">
                            <label htmlFor="teacher">Teacher:</label>
                            <select
                                name="teacher"
                                value={suggestedSubstitute.teacher}
                                onChange={handleSubstituteChange}
                            >
                                <option value="">Select Teacher</option>
                                {teachersList.map((teacher) => (
                                    <option key={teacher._id} value={teacher._id}>{teacher.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="class">Class:</label>
                            <input
                                type="text"
                                name="class"
                                value={suggestedSubstitute.class}
                                onChange={handleSubstituteChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="section">Section:</label>
                            <input
                                type="text"
                                name="section"
                                value={suggestedSubstitute.section}
                                onChange={handleSubstituteChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="timeSlot">Time Slot:</label>
                            <input
                                type="text"
                                name="timeSlot"
                                value={suggestedSubstitute.timeSlot}
                                onChange={handleSubstituteChange}
                                placeholder="e.g., 10:00 AM - 11:00 AM"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="subject">Subject:</label>
                            <input
                                type="text"
                                name="subject"
                                value={suggestedSubstitute.subject}
                                onChange={handleSubstituteChange}
                            />
                        </div>
                        <button type="button" onClick={handleAddSubstitute}>Add Suggestion</button>
                    </div>

                    <button type="submit" className="submit-button">Submit Leave Application</button>
                </form>
            </div>
        );
    }

    export default LeaveApplicationForm;