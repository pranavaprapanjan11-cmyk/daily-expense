const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Expense = require('../models/Expense');

// Middleware to get deviceId
const getDeviceId = (req, res, next) => {
    const deviceId = req.headers['x-device-id'];
    if (!deviceId) {
        return res.status(400).json({ msg: 'Device ID missing' });
    }
    req.deviceId = deviceId;
    next();
};

router.use(getDeviceId);

// Get all expenses for specific device
router.get('/', async (req, res) => {
    try {
        const expenses = await Expense.find({ deviceId: req.deviceId }).sort({ date: -1 });
        res.json(expenses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Add new expense
router.post('/', async (req, res) => {
    const { amount, category, note, date } = req.body;

    try {
        const newExpense = new Expense({
            amount,
            category,
            note,
            date,
            deviceId: req.deviceId
        });

        const expense = await newExpense.save();
        res.json(expense);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update expense
router.put('/:id', async (req, res) => {
    const { amount, category, note, date } = req.body;

    // Build expense object
    const expenseFields = {};
    if (amount) expenseFields.amount = amount;
    if (category) expenseFields.category = category;
    if (note) expenseFields.note = note;
    if (date) expenseFields.date = date;

    try {
        let expense = await Expense.findOne({ _id: req.params.id, deviceId: req.deviceId });

        if (!expense) return res.status(404).json({ msg: 'Expense not found' });

        expense = await Expense.findOneAndUpdate(
            { _id: req.params.id, deviceId: req.deviceId },
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
router.delete('/:id', async (req, res) => {
    try {
        const expense = await Expense.findOne({ _id: req.params.id, deviceId: req.deviceId });

        if (!expense) return res.status(404).json({ msg: 'Expense not found' });

        await Expense.findOneAndDelete({ _id: req.params.id, deviceId: req.deviceId });

        res.json({ msg: 'Expense removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get expense summary (category wise total)
router.get('/summary', async (req, res) => {
    try {
        const summary = await Expense.aggregate([
            {
                $match: { deviceId: req.deviceId }
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
