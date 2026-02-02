"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import ExpenseForm from "./ExpenseForm";
import ExpenseList from "./ExpenseList";
import ReminderSettings from "./ReminderSettings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from "recharts";

interface Expense {
    _id: string;
    amount: number;
    category: string;
    note: string;
    date: string;
    user: string;
}

interface SummaryItem {
    _id: string; // category
    totalAmount: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function Dashboard() {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [summary, setSummary] = useState<SummaryItem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            const [expensesRes, summaryRes] = await Promise.all([
                api.get("/expenses"),
                api.get("/expenses/summary"),
            ]);
            setExpenses(expensesRes.data);
            setSummary(summaryRes.data);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const totalExpense = summary.reduce((acc, item) => acc + item.totalAmount, 0);

    // Prepare data for Pie Chart
    const pieData = summary.map((item) => ({
        name: item._id,
        value: item.totalAmount,
    }));

    // Prepare data for Daily Trend (Bar Chart) - Last 7 days
    // Group expenses by date
    // This logic is simple for now, can be improved.
    const last7DaysMap = new Map<string, number>();
    // Initialize last 7 days with 0
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        last7DaysMap.set(d.toISOString().split('T')[0], 0);
    }

    expenses.forEach(exp => {
        const dateStr = new Date(exp.date).toISOString().split('T')[0];
        if (last7DaysMap.has(dateStr)) {
            last7DaysMap.set(dateStr, last7DaysMap.get(dateStr)! + exp.amount);
        }
    });

    const barData = Array.from(last7DaysMap.entries()).map(([date, amount]) => ({
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        amount
    }));


    if (loading) {
        return <div>Loading dashboard...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Spending</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{totalExpense.toFixed(2)}</div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Total across all categories
                        </p>
                    </CardContent>
                </Card>
                <ReminderSettings />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Charts */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Spending Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barData}>
                                    <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                                    <Tooltip
                                        formatter={(value: number) => [`₹${value}`, 'Amount']}
                                        cursor={{ fill: 'transparent' }}
                                    />
                                    <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Category Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value: number) => [`₹${value}`, 'Amount']} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4">
                    <ExpenseList expenses={expenses} onDelete={fetchData} />
                </div>
                <div className="col-span-3">
                    <ExpenseForm onExpenseAdded={fetchData} />
                </div>
            </div>
        </div>
    );
}
