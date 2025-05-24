import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerUser = (userData) => API.post('/auth/register', userData);

export const loginUser = (formData) => {
  console.log('Sending login data:', formData);
  return axios.post('http://localhost:5000/api/auth/login', formData);
};

export const getProfile = () => API.get('/auth/profile');

export const submitLeaveRequest = (data) => API.post('/leaves', data);

export const getMyLeaves = () => API.get('/leaves/my');

export const getDepartmentLeaves = () => API.get('/leaves/department');

export const getPendingLeaves = () => API.get('/leaves/pending');

export const updateLeaveStatus = (leaveId, status) =>
  API.put(`/leaves/${leaveId}/status`, { status });


// ✅ Notification APIs:
export const getNotifications = () => API.get('/notifications');

// export const markNotificationAsRead = (id) => API.patch(`/notifications/${id}/read`);

// export const deleteNotification = (id) => API.delete(`/notifications/${id}`);

// Mark notification as read
export const markNotificationAsRead = (id) => API.put(`/notifications/${id}/read`);

// Delete notification
export const deleteNotification = (id) => API.delete(`/notifications/${id}`);
