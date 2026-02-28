const { z } = require('zod');

const createAssignmentSchema = z.object({
    body: z.object({
        title: z.string().min(1, 'Title is required').max(255),
        description: z.string().optional(),
        due_date: z.string().datetime().optional(),
        status: z.enum(['pending', 'completed']).default('pending'),
    }),
});

const updateAssignmentSchema = z.object({
    body: z.object({
        title: z.string().min(1, 'Title is required').max(255).optional(),
        description: z.string().optional(),
        due_date: z.string().datetime().optional(),
        status: z.enum(['pending', 'completed']).optional(),
    }).refine(data => Object.keys(data).length > 0, {
        message: "At least one field must be provided for update."
    }),
});

const getAssignmentsQuerySchema = z.object({
    query: z.object({
        status: z.enum(['pending', 'completed']).optional(),
    }),
});

module.exports = {
    createAssignmentSchema,
    updateAssignmentSchema,
    getAssignmentsQuerySchema,
};
