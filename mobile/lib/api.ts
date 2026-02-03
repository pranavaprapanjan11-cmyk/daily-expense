import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
});

api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
        config.headers['x-auth-token'] = token;
    }
    return config;
});

export const ExpenseAPI = {
    getExpenses: async () => {
        const response = await api.get('/expenses');
        return response.data;
    },
    addExpense: async (expense: any) => {
        const response = await api.post('/expenses', expense);
        return response.data;
    },
    deleteExpense: async (id: string) => {
        await api.delete(`/expenses/${id}`);
    },
    updateExpense: async (id: string, expense: any) => {
        const response = await api.put(`/expenses/${id}`, expense);
        return response.data;
    }
};

export const AuthAPI = {
    login: async (credentials: any) => {
        const response = await api.post('/auth/login', credentials);
        if (response.data.token) {
            await AsyncStorage.setItem('token', response.data.token);
        }
        return response.data;
    },
    register: async (userData: any) => {
        const response = await api.post('/auth/register', userData);
        if (response.data.token) {
            await AsyncStorage.setItem('token', response.data.token);
        }
        return response.data;
    },
    verifyToken: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },
    logout: async () => {
        await AsyncStorage.removeItem('token');
    }
};
