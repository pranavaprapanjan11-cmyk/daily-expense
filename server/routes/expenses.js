const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Expense = require('../models/Expense');

const auth = require('../middleware/auth');

// Get all expenses for specific user
router.get('/', auth, async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
        res.json(expenses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Add new expense
router.post('/', auth, async (req, res) => {
    const { amount, category, note, date } = req.body;

    try {
        const newExpense = new Expense({
            amount,
            category,
            note,
            date,
            user: req.user.id
        });

        const expense = await newExpense.save();
        res.json(expense);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update expense
router.put('/:id', auth, async (req, res) => {
    const { amount, category, note, date } = req.body;

    // Build expense object
    const expenseFields = {};
    if (amount) expenseFields.amount = amount;
    if (category) expenseFields.category = category;
    if (note) expenseFields.note = note;
    if (date) expenseFields.date = date;

    try {
        let expense = await Expense.findOne({ _id: req.params.id, user: req.user.id });

        if (!expense) return res.status(404).json({ msg: 'Expense not found' });

        expense = await Expense.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { $set: expenseFields },
            { new: true }
        );

        res.json(expense);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Delete expense
router.delete('/:id', auth, async (req, res) => {
    try {
        const expense = await Expense.findOne({ _id: req.params.id, user: req.user.id });

        if (!expense) return res.status(404).json({ msg: 'Expense not found' });

        await Expense.findOneAndDelete({ _id: req.params.id, user: req.user.id });

        res.json({ msg: 'Expense removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get expense summary (category wise total)
router.get('/summary', auth, async (req, res) => {
    try {
        const summary = await Expense.aggregate([
            {
                $match: { user: new mongoose.Types.ObjectId(req.user.id) }
            },
            {
                $group: {
                    _id: "$category",
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);
        res.json(summary);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
