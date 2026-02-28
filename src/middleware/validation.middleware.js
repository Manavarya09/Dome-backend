const { ZodError } = require('zod');
const ApiResponse = require('../utils/apiResponse');

/**
 * Middleware to validate request body/query/params against a Zod schema
 */
const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            const formattedErrors = error.errors.map((err) => ({
                path: err.path.join('.'),
                message: err.message,
            }));
            return ApiResponse.error(res, 'Validation failed', 400, formattedErrors);
        }
        next(error);
    }
};

module.exports = validate;
