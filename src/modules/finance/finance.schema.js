const { z } = require('zod');

const createTransactionSchema = z.object({
    body: z.object({
        amount: z.number().positive('Amount must be positive'),
        category: z.string().min(1, 'Category is required'),
        description: z.string().optional(),
        date: z.string().datetime().optional().default(() => new Date().toISOString()),
    }),
});

const updateTransactionSchema = z.object({
    body: z.object({
        amount: z.number().positive('Amount must be positive').optional(),
        category: z.string().min(1, 'Category is required').optional(),
        description: z.string().optional(),
        date: z.string().datetime().optional(),
    }).refine(data => Object.keys(data).length > 0, {
        message: "At least one field must be provided for update."
    }),
});

const getTransactionsQuerySchema = z.object({
    query: z.object({
        category: z.string().optional(),
        startDate: z.string().datetime().optional(),
        endDate: z.string().datetime().optional(),
    }),
});

module.exports = {
    createTransactionSchema,
    updateTransactionSchema,
    getTransactionsQuerySchema,
};
