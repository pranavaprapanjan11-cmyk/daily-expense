import React, { createContext, useContext, useState, useEffect } from 'react';
import { Expense, ExpenseContextType } from '../lib/types';
import { ExpenseAPI } from '../lib/api';

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await ExpenseAPI.getExpenses();
            // Safety check: Ensure data is an array
            const expenseArray = Array.isArray(data) ? data : [];

            // Map MongoDB _id to id if necessary
            const normalized = expenseArray.map((e: any) => ({
                ...e,
                id: e._id || e.id
            }));
            setExpenses(normalized.sort((a: Expense, b: Expense) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        } catch (e) {
            console.error("Failed to load expenses", e);
            // Set empty array on error so app doesn't crash
            setExpenses([]);
        } finally {
            setLoading(false);
        }
    };

    const addExpense = async (expenseData: Omit<Expense, "id" | "createdAt">) => {
        try {
            const newItem = await ExpenseAPI.addExpense(expenseData);
            const normalized = { ...newItem, id: newItem._id || newItem.id };
            setExpenses(prev => [normalized, ...prev]);
        } catch (e) {
            console.error("Failed to add expense", e);
            throw e;
        }
    };

    const deleteExpense = async (id: string) => {
        try {
            await ExpenseAPI.deleteExpense(id);
            setExpenses(prev => prev.filter(e => e.id !== id));
        } catch (e) {
            console.error("Failed to delete expense", e);
        }
    };

    const editExpense = async (updatedExpense: Expense) => {
        try {
            const updated = await ExpenseAPI.updateExpense(updatedExpense.id, updatedExpense);
            const normalized = { ...updated, id: updated._id || updated.id };
            setExpenses(prev => prev.map(e => e.id === normalized.id ? normalized : e));
        } catch (e) {
            console.error("Failed to edit expense", e);
        }
    };

    // Calculate summary
    const summaryMap = new Map<string, number>();
    expenses.forEach(e => {
        summaryMap.set(e.category, (summaryMap.get(e.category) || 0) + e.amount);
    });
    const summary = Array.from(summaryMap.entries()).map(([category, total]) => ({ category, total }));

    const refreshExpenses = async () => {
        await loadData();
    };

    return (
        <ExpenseContext.Provider value={{ expenses, addExpense, deleteExpense, editExpense, summary, loading, refreshExpenses }}>
            {children}
        </ExpenseContext.Provider>
    );
};

export const useExpenses = () => {
    const context = useContext(ExpenseContext);
    if (!context) throw new Error("useExpenses must be used within an ExpenseProvider");
    return context;
};
