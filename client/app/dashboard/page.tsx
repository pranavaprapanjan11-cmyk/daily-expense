"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Dashboard from "@/components/Dashboard";
import { Button } from "@/components/ui/Button";

export default function DashboardPage() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();

    // NO LOGIN REQUIREMENT - We use deviceId automatically in api.ts
    const userDisplay = user ? user.username : "Guest User";

    if (loading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm dark:bg-slate-950 dark:border-slate-800 lg:px-6">
                <h1 className="text-lg font-bold">Expense Manager</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Welcome, {userDisplay}
                    </span>
                    {user ? (
                        <Button variant="outline" size="sm" onClick={logout}>
                            Logout
                        </Button>
                    ) : (
                        <Link href="/login">
                            <Button variant="outline" size="sm">Login</Button>
                        </Link>
                    )}
                </div>
            </header>
            <main className="container mx-auto p-4 lg:p-6">
                <Dashboard />
            </main>
        </div>
    );
}
