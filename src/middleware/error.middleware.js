const ApiResponse = require('../utils/apiResponse');
const env = require('../config/env');

/**
 * Global Error Handler Middleware
 */
const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log the stack trace for debugging

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Do not send stack traces in production
    const errorData = env.nodeEnv === 'development' ? err.stack : null;

    return ApiResponse.error(res, message, statusCode, errorData);
};

module.exports = errorHandler;
