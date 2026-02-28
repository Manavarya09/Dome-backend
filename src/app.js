const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const env = require('./config/env');
const errorHandler = require('./middleware/error.middleware');
const { globalLimiter } = require('./middleware/rateLimit.middleware');
const ApiResponse = require('./utils/apiResponse');

// Import Routers
const authRoutes = require('./modules/auth/auth.routes');
const financeRoutes = require('./modules/finance/finance.routes');
const assignmentRoutes = require('./modules/assignments/assignment.routes');
const dashboardRoutes = require('./modules/dashboard/dashboard.routes');

const app = express();

// --- Security & Utility Middleware ---
app.use(helmet()); // Secure HTTP headers
app.use(cors({
    origin: env.corsOrigin,
    credentials: true,
}));
// Prevent payload abuse
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Global rate limiting
app.use(globalLimiter);

// --- Routes ---
const apiRouter = express.Router();

// Health check
apiRouter.get('/health', (req, res) => {
    return ApiResponse.success(res, 'DOME Server is running correctly!');
});

// Mount modules
apiRouter.use('/auth', authRoutes);
apiRouter.use('/finance', financeRoutes);
apiRouter.use('/assignments', assignmentRoutes);
apiRouter.use('/dashboard', dashboardRoutes);

app.use('/api', apiRouter);

// --- Handle Unmatched Routes ---
app.all('*', (req, res, next) => {
    return ApiResponse.error(res, `Can't find ${req.originalUrl} on the server!`, 404);
});

// --- Error Handling Middleware ---
app.use(errorHandler);

module.exports = app;
