const app = require('./app');
const env = require('./config/env');

const PORT = env.port || 5000;

// Catch unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

// Start Server
const server = app.listen(PORT, () => {
    console.log(`DOME Server running in ${env.nodeEnv || 'development'} mode on port ${PORT}`);
});

// Handle graceful shutdown signals (e.g. from Vercel/Docker)
process.on('SIGTERM', () => {
    console.log('SIGTERM RECEIVED. Shutting down gracefully');
    server.close(() => {
        console.log('Process terminated!');
    });
});
