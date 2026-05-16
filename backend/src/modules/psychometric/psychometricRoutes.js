const express = require('express');
const router = express.Router();
const { getQuestions, submitAssessment } = require('./psychometricController');
const authMiddleware = require('../../middleware/auth');

router.get('/questions', getQuestions);
router.post('/submit', authMiddleware, submitAssessment);

module.exports = router;
