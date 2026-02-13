const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
        enum: ['Food', 'Travel', 'Snacks', 'Education', 'Personal', 'Others'],
        default: 'Others'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    note: {
        type: String,
        trim: true,
        maxlength: 200
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for faster queries on date
ExpenseSchema.index({ date: -1 });

module.exports = mongoose.model('Expense', ExpenseSchema);
