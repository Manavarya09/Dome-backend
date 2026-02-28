const DashboardService = require('./dashboard.service');
const ApiResponse = require('../../utils/apiResponse');

class DashboardController {
    static async getSummary(req, res, next) {
        try {
            const summary = await DashboardService.getSummary(req.user.id);
            return ApiResponse.success(res, 'Dashboard summary retrieved successfully', summary);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = DashboardController;
