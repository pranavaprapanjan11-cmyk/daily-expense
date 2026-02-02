"use client";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Trash2 } from "lucide-react";
import api from "@/lib/api";

interface Expense {
    _id: string;
    amount: number;
    category: string;
    note: string;
    date: string;
}

interface ExpenseListProps {
    expenses: Expense[];
    onDelete: () => void;
}

export default function ExpenseList({ expenses, onDelete }: ExpenseListProps) {
    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this expense?")) {
            try {
                await api.delete(`/expenses/${id}`);
                onDelete();
            } catch (error) {
                console.error("Failed to delete expense", error);
            }
        }
    };

    // Sort expenses by date desc
    const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Recent Expenses</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {sortedExpenses.length === 0 ? (
                        <p className="text-sm text-slate-500 text-center py-4">No expenses found.</p>
                    ) : (
                        sortedExpenses.map((expense) => (
                            <div
                                key={expense._id}
                                className="flex items-center justify-between rounded-lg border p-3 hover:bg-slate-50 dark:hover:bg-slate-900"
                            >
                                <div className="flex flex-col gap-1">
                                    <span className="font-medium">{expense.category}</span>
                                    <span className="text-xs text-slate-500">
                                        {new Date(expense.date).toLocaleDateString()} {expense.note && `• ${expense.note}`}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="font-bold">₹{expense.amount}</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                                        onClick={() => handleDelete(expense._id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
