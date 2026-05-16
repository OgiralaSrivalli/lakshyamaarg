const express = require('express');
const router = express.Router();
const { register, verifyOtp, login, getProfile } = require('./userController');
const authMiddleware = require('../../middleware/auth');

router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);
router.get('/me', authMiddleware, getProfile);

module.exports = router;
