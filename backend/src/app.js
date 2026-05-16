const express = require('express');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./modules/user/userRoutes');
const psychometricRoutes = require('./modules/psychometric/psychometricRoutes');
const recommendationRoutes = require('./modules/recommendation/recommendationRoutes');
const chatbotRoutes = require('./modules/chatbot/chatbotRoutes');
const opportunityRoutes = require('./modules/opportunity/opportunityRoutes');

const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Lakshyamaarg API is running 🚀', timestamp: new Date().toISOString() });
});

// Module routes
app.use('/api/auth', userRoutes);
app.use('/api/psychometric', psychometricRoutes);
app.use('/api/recommendation', recommendationRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/opportunities', opportunityRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n🚀 Lakshyamaarg API running on http://localhost:${PORT}`);
    console.log(`📚 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔐 Auth: POST /api/auth/register | POST /api/auth/login`);
    console.log(`🧠 Psychometric: GET /api/psychometric/questions | POST /api/psychometric/submit`);
    console.log(`🗺️  Recommendation: GET /api/recommendation/my`);
    console.log(`🤖 Chatbot: POST /api/chatbot/message`);
    console.log(`🎯 Opportunities: GET /api/opportunities\n`);
});

module.exports = app;
