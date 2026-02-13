import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://daily-expense-manager-production.up.railway.app/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
