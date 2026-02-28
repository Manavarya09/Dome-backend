const AssignmentService = require('./assignment.service');
const ApiResponse = require('../../utils/apiResponse');

class AssignmentController {
    static async getAssignments(req, res, next) {
        try {
            const filters = {
                status: req.query.status,
            };
            const assignments = await AssignmentService.getAssignments(req.user.id, filters);
            return ApiResponse.success(res, 'Assignments retrieved successfully', assignments);
        } catch (error) {
            next(error);
        }
    }

    static async createAssignment(req, res, next) {
        try {
            const assignment = await AssignmentService.createAssignment(req.user.id, req.body);
            return ApiResponse.success(res, 'Assignment created successfully', assignment, 201);
        } catch (error) {
            next(error);
        }
    }

    static async updateAssignment(req, res, next) {
        try {
            const { id } = req.params;
            const assignment = await AssignmentService.updateAssignment(req.user.id, id, req.body);
            return ApiResponse.success(res, 'Assignment updated successfully', assignment);
        } catch (error) {
            if (error.message === 'Assignment not found or unauthorized') {
                return ApiResponse.error(res, error.message, 404);
            }
            next(error);
        }
    }

    static async deleteAssignment(req, res, next) {
        try {
            const { id } = req.params;
            await AssignmentService.deleteAssignment(req.user.id, id);
            return ApiResponse.success(res, 'Assignment deleted successfully', null, 200);
        } catch (error) {
            if (error.message === 'Assignment not found or unauthorized') {
                return ApiResponse.error(res, error.message, 404);
            }
            next(error);
        }
    }
}

module.exports = AssignmentController;
