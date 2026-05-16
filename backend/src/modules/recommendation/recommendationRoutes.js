const express = require('express');
const router = express.Router();
const { getRecommendation, getRoadmapByKey } = require('./recommendationController');
const authMiddleware = require('../../middleware/auth');

router.get('/my', authMiddleware, getRecommendation);
router.get('/roadmap/:key', getRoadmapByKey);

module.exports = router;
