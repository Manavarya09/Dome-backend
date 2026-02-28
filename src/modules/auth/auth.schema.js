const { z } = require('zod');

const signupSchema = z.object({
    body: z.object({
        email: z.string().email('Invalid email address'),
        password: z.string().min(8, 'Password must be at least 8 characters long'),
    }),
});

const loginSchema = z.object({
    body: z.object({
        email: z.string().email('Invalid email address'),
        password: z.string().nonempty('Password is required'),
    }),
});

module.exports = {
    signupSchema,
    loginSchema,
};
