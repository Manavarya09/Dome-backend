const express = require('express');
const router = express.Router();

const AuthController = require('./auth.controller');
const validate = require('../../middleware/validation.middleware');
const { signupSchema, loginSchema } = require('./auth.schema');
const { authLimiter } = require('../../middleware/rateLimit.middleware');

router.post('/signup', authLimiter, validate(signupSchema), AuthController.signup);
router.post('/login', authLimiter, validate(loginSchema), AuthController.login);

module.exports = router;
