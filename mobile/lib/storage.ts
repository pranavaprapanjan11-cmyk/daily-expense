import AsyncStorage from '@react-native-async-storage/async-storage';
import { Expense } from './types';

const STORAGE_KEY = 'daily_expenses_data';

export const Storage = {
    async getExpenses(): Promise<Expense[]> {
        try {
            const json = await AsyncStorage.getItem(STORAGE_KEY);
            return json != null ? JSON.parse(json) : [];
        } catch (e) {
            console.error('Failed to load expenses', e);
            return [];
        }
    },

    async saveExpenses(expenses: Expense[]): Promise<void> {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
        } catch (e) {
            console.error('Failed to save expenses', e);
        }
    },

    async clear(): Promise<void> {
        await AsyncStorage.removeItem(STORAGE_KEY);
    }
};
