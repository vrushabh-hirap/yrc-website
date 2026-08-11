import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
});

// Interceptor to attach Bearer token
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('yrc_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Auth
export const loginUser = (data) => api.post('/auth/login', data);
export const registerTeam = (data) => api.post('/auth/register', data);
export const getMe = () => api.get('/auth/me');

// Teams
export const getMyTeam = () => api.get('/teams/my-team');
export const submitPaper = (formData) => api.post('/teams/my-team/submit-paper', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});

// Papers
export const getAssignedPapers = () => api.get('/papers/assigned');
export const approvePaper = (paperId) => api.post(`/papers/${paperId}/approve`);
export const rejectPaper = (paperId, reason) => api.post(`/papers/${paperId}/reject`, { reason });
export const updatePublicationStatus = (paperId, publicationStatus) => 
    api.put(`/papers/${paperId}/publication-status`, { publicationStatus });

// Feedback
export const submitFeedback = (paperId, content) => api.post('/feedback', { paperId, content });

// Admin
export const getAdminStats = () => api.get('/admin/stats');
export const getAllTeams = (params) => api.get('/teams', { params });
export const assignMentor = (teamId, mentorId) => api.put(`/teams/${teamId}/assign-mentor`, { mentorId });
export const getFacultyList = () => api.get('/admin/faculty');
export const createFacultyAccount = (data) => api.post('/admin/faculty', data);
export const deleteTeam = (teamId) => api.delete(`/admin/teams/${teamId}`);

export default api;
