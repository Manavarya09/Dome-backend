const AuthService = require('./auth.service');
const ApiResponse = require('../../utils/apiResponse');

class AuthController {
    static async signup(req, res, next) {
        try {
            const { email, password } = req.body;
            const result = await AuthService.signup(email, password);
            return ApiResponse.success(res, 'User registered successfully', result, 201);
        } catch (error) {
            if (error.message === 'User already exists') {
                return ApiResponse.error(res, error.message, 409);
            }
            next(error);
        }
    }

    static async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const result = await AuthService.login(email, password);
            return ApiResponse.success(res, 'Logged in successfully', result, 200);
        } catch (error) {
            if (error.message === 'Invalid email or password') {
                return ApiResponse.error(res, error.message, 401);
            }
            next(error);
        }
    }
}

module.exports = AuthController;
