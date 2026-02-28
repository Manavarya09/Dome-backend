const express = require('express');
const router = express.Router();

const AssignmentController = require('./assignment.controller');
const validate = require('../../middleware/validation.middleware');
const authenticate = require('../../middleware/auth.middleware');
const {
    createAssignmentSchema,
    updateAssignmentSchema,
    getAssignmentsQuerySchema,
} = require('./assignment.schema');

// All assignment routes require authentication
router.use(authenticate);

router.get('/', validate(getAssignmentsQuerySchema), AssignmentController.getAssignments);
router.post('/', validate(createAssignmentSchema), AssignmentController.createAssignment);
router.put('/:id', validate(updateAssignmentSchema), AssignmentController.updateAssignment);
router.delete('/:id', AssignmentController.deleteAssignment);

module.exports = router;
