import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Attach token automatically
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('lm_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const verifyOtp = (data) => API.post('/auth/verify-otp', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getProfile = () => API.get('/auth/me');

// Psychometric
export const getQuestions = () => API.get('/psychometric/questions');
export const submitAssessment = (answers) => API.post('/psychometric/submit', { answers });

// Recommendation
export const getRecommendation = () => API.get('/recommendation/my');
export const getRoadmap = (key) => API.get(`/recommendation/roadmap/${key}`);

// Chatbot
export const sendChatMessage = (message, language = 'en', parent_mode = false) =>
    API.post('/chatbot/message', { message, language, parent_mode });

// Opportunities
export const getOpportunities = (domain = '', type = '') =>
    API.get('/opportunities', { params: { domain, type } });

export default API;
