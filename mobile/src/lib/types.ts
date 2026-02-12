export interface Expense {
    id: string;
    amount: number;
    category: string;
    note: string;
    date: string;
    createdAt: number;
}

export type ExpenseContextType = {
    expenses: Expense[];
    addExpense: (expense: Omit<Expense, "id" | "createdAt">) => Promise<void>;
    deleteExpense: (id: string) => Promise<void>;
    editExpense: (expense: Expense) => Promise<void>;
    summary: { category: string; total: number }[];
    loading: boolean;
    refreshExpenses: () => Promise<void>;
};

export const CATEGORIES = ['Food', 'Travel', 'Snacks', 'Education', 'Personal', 'Others'];
