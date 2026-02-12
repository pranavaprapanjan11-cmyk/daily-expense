import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { Platform } from 'react-native';

import { CONFIG } from '../constants/Config';

// STRICT API URL RESOLUTION
// Use hardcoded Config to ensure zero bundling/startup failures.
const API_URL = CONFIG.API_URL;

console.log("API Initialized with:", API_URL);

const DEVICE_ID_KEY = 'device_id';

const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
});

// Helper to get device ID (NOW USER ID)
export const getUserId = async (): Promise<string | null> => {
    try {
        return await AsyncStorage.getItem(DEVICE_ID_KEY);
    } catch (e) {
        console.error("Error getting User ID", e);
        return null;
    }
};

export const setUserId = async (id: string): Promise<void> => {
    await AsyncStorage.setItem(DEVICE_ID_KEY, id);
};

export const clearUserId = async (): Promise<void> => {
    await AsyncStorage.removeItem(DEVICE_ID_KEY);
};

// Add interceptor to attach Device ID (use default for standalone mode)
api.interceptors.request.use(async (config) => {
    let userId = await getUserId();

    // If no userId exists, create and save a default one
    if (!userId) {
        userId = Crypto.randomUUID();
        await setUserId(userId);
        console.log("Generated new device ID:", userId);
    }

    config.headers['x-device-id'] = userId;
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
