const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
    origin: '*', // Allow your phone to connect to your laptop
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'x-auth-token']
}));
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(morgan('dev'));

// Database Connection
let dbError = null;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/expense-manager')
    .then(() => {
        console.log('MongoDB Connected');
        dbError = null;
    })
    .catch(err => {
        console.error('MongoDB Connection Error:', err);
        dbError = err.message;
    });

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/expenses', require('./routes/expenses'));

app.get('/api/health', (req, res) => {
    res.json({
        status: 'UP',
        db: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
        readyState: mongoose.connection.readyState,
        dbError: dbError,
        env: process.env.NODE_ENV
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
        msg: 'Something broke!',
        error: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
