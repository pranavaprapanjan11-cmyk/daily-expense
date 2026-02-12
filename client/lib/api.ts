import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://daily-expense-manager-production.up.railway.app/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Device ID Logic for Zero-Login
if (typeof window !== 'undefined') {
    let deviceId = localStorage.getItem('device-id');
    if (!deviceId) {
        deviceId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('device-id', deviceId);
    }
    api.defaults.headers.common['x-device-id'] = deviceId;
}

export default api;
