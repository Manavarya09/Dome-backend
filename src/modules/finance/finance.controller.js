const FinanceService = require('./finance.service');
const ApiResponse = require('../../utils/apiResponse');

class FinanceController {
    static async getTransactions(req, res, next) {
        try {
            const filters = {
                category: req.query.category,
                startDate: req.query.startDate,
                endDate: req.query.endDate,
            };
            const transactions = await FinanceService.getTransactions(req.user.id, filters);
            return ApiResponse.success(res, 'Transactions retrieved successfully', transactions);
        } catch (error) {
            next(error);
        }
    }

    static async createTransaction(req, res, next) {
        try {
            const transaction = await FinanceService.createTransaction(req.user.id, req.body);
            return ApiResponse.success(res, 'Transaction created successfully', transaction, 201);
        } catch (error) {
            next(error);
        }
    }

    static async updateTransaction(req, res, next) {
        try {
            const { id } = req.params;
            const transaction = await FinanceService.updateTransaction(req.user.id, id, req.body);
            return ApiResponse.success(res, 'Transaction updated successfully', transaction);
        } catch (error) {
            if (error.message === 'Transaction not found or unauthorized') {
                return ApiResponse.error(res, error.message, 404);
            }
            next(error);
        }
    }

    static async deleteTransaction(req, res, next) {
        try {
            const { id } = req.params;
            await FinanceService.deleteTransaction(req.user.id, id);
            return ApiResponse.success(res, 'Transaction deleted successfully', null, 200); // Or 204 No Content
        } catch (error) {
            if (error.message === 'Transaction not found or unauthorized') {
                return ApiResponse.error(res, error.message, 404);
            }
            next(error);
        }
    }
}

module.exports = FinanceController;
