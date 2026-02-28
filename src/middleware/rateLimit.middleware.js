const rateLimit = require('express-rate-limit');
const ApiResponse = require('../utils/apiResponse');

/**
 * Global rate limiter to prevent abuse and brute-force attacks across all routes
 */
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window`
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req, res, next, options) => {
        return ApiResponse.error(res, 'Too many requests, please try again later.', options.statusCode);
    },
});

/**
 * Stricter rate limiter specifically for authentication routes (login/signup)
 */
const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    limit: 10, // Limit each IP to 10 login/signup requests per hour
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: (req, res, next, options) => {
        return ApiResponse.error(res, 'Too many authentication attempts, please try again later.', options.statusCode);
    },
});

module.exports = {
    globalLimiter,
    authLimiter,
};
