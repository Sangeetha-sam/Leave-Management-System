import axios from 'axios';

// ✅ Use the environment variable from Vercel
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL + '/api',
});

// ✅ Add token to request headers
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Use the same API instance for all requests
export const registerUser = (userData) => API.post('/auth/register', userData);

export const loginUser = (formData) => API.post('/auth/login', formData);

export const getProfile = () => API.get('/auth/profile');

export const submitLeaveRequest = (data) => API.post('/leaves', data);

export const getMyLeaves = () => API.get('/leaves/my');

export const getDepartmentLeaves = () => API.get('/leaves/department');

export const getPendingLeaves = () => API.get('/leaves/pending');

export const updateLeaveStatus = (leaveId, status) =>
  API.put(`/leaves/${leaveId}/status`, { status });

// ✅ Notification APIs
export const getNotifications = () => API.get('/notifications');

export const markNotificationAsRead = (id) => API.put(`/notifications/${id}/read`);

export const deleteNotification = (id) => API.delete(`/notifications/${id}`);
