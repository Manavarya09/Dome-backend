/**
 * Standardize API responses across the application
 */
class ApiResponse {
    constructor(success, message, data = null) {
        this.success = success;
        this.message = message;
        this.data = data;
    }

    static success(res, message, data = null, statusCode = 200) {
        return res.status(statusCode).json(new ApiResponse(true, message, data));
    }

    static error(res, message, statusCode = 500, data = null) {
        return res.status(statusCode).json(new ApiResponse(false, message, data));
    }
}

module.exports = ApiResponse;
