const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// STRICT STARTUP CHECKS
if (!process.env.MONGODB_URI) {
    console.warn('WARNING: MONGODB_URI is not defined. Using fallback if available or failing at runtime.');
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
    origin: '*', // Allow all origins for mobile app compatibility
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'x-auth-token', 'x-device-id'] // Added x-device-id
}));
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(morgan('dev'));

// Database Connection
const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            console.error('ERROR: MONGODB_URI is not set in environment variables.');
            return;
        }
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log('MongoDB Connected Successfully');
    } catch (err) {
        console.error('ERROR: MongoDB Connection Failed');
        console.error(err.message);
        // Do not exit, let health check reflect status
    }
};

connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/expenses', require('./routes/expenses'));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
    const dbState = mongoose.connection.readyState;
    const isUp = dbState === 1; // 1 = connected

    if (!isUp) {
        return res.status(503).json({
            status: 'DOWN',
            db: 'Disconnected',
            readyState: dbState,
            timestamp: new Date().toISOString()
        });
    }

    res.json({
        status: 'UP',
        db: 'Connected',
        readyState: dbState,
        env: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString()
    });
});

app.get('/', (req, res) => {
    res.send('Daily Expense Manager API');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('SERVER ERROR:', err.message);
    console.error(err.stack);
    res.status(500).json({
        msg: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
