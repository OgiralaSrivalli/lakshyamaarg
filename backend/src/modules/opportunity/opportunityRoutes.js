const express = require('express');
const router = express.Router();
const { getOpportunities, getOpportunityById } = require('./opportunityController');
const authMiddleware = require('../../middleware/auth');

router.get('/', authMiddleware, getOpportunities);
router.get('/:id', authMiddleware, getOpportunityById);

module.exports = router;
