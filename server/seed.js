const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Expense = require('./models/Expense');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/expense-manager')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

const seedData = async () => {
    try {
        await User.deleteMany({});
        await Expense.deleteMany({});

        const user = new User({
            username: 'demo_student',
            email: 'demo@student.com',
            password: 'password123'
        });

        await user.save();
        console.log('User created: demo@student.com / password123');

        const expenses = [
            {
                user: user._id,
                amount: 150,
                category: 'Food',
                note: 'Lunch at canteen',
                date: new Date()
            },
            {
                user: user._id,
                amount: 50,
                category: 'Travel',
                note: 'Bus ticket',
                date: new Date()
            },
            {
                user: user._id,
                amount: 500,
                category: 'Study',
                note: 'Books',
                date: new Date(Date.now() - 86400000) // Yesterday
            },
            {
                user: user._id,
                amount: 1200,
                category: 'Entertainment',
                note: 'Movie night',
                date: new Date(Date.now() - 172800000) // 2 days ago
            }
        ];

        await Expense.insertMany(expenses);
        console.log('Sample expenses added');

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedData();
