const express = require('express');
const router = express.Router();

const DashboardController = require('./dashboard.controller');
const authenticate = require('../../middleware/auth.middleware');

// Dashboard routes require authentication
router.use(authenticate);

router.get('/', DashboardController.getSummary);

module.exports = router;
