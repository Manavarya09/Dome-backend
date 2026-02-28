const jwt = require('jsonwebtoken');
const env = require('../config/env');
const ApiResponse = require('../utils/apiResponse');

/**
 * Middleware to protect routes that require authentication.
 * Verifies the JWT token and attaches the decoded user payload to req.user.
 */
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return ApiResponse.error(res, 'Authorization token missing or invalid', 401);
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, env.jwtSecret);
        req.user = decoded; // Attach user payload ({ id, email, role, etc }) to request
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return ApiResponse.error(res, 'Token expired', 401);
        }
        return ApiResponse.error(res, 'Invalid token', 401);
    }
};

module.exports = authenticate;
