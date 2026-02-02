"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Bell, BellOff } from "lucide-react";

export default function ReminderSettings() {
    const [permission, setPermission] = useState<NotificationPermission>("default");
    const [reminderTime, setReminderTime] = useState("");
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setPermission(Notification.permission);
            const storedTime = localStorage.getItem("reminderTime");
            const storedEnabled = localStorage.getItem("reminderEnabled") === "true";
            if (storedTime) setReminderTime(storedTime);
            setEnabled(storedEnabled);
        }
    }, []);

    const requestPermission = async () => {
        const result = await Notification.requestPermission();
        setPermission(result);
        if (result === "granted") {
            // Test notification
            new Notification("Notifications Enabled", {
                body: "You will be reminded to add your expenses!",
            });
        }
    };

    const handleSave = () => {
        if (permission !== "granted") {
            requestPermission();
            return;
        }
        localStorage.setItem("reminderTime", reminderTime);
        localStorage.setItem("reminderEnabled", enabled.toString());
        alert("Reminder settings saved!");
    };

    const toggleEnabled = () => {
        if (permission !== "granted" && !enabled) {
            requestPermission();
        }
        setEnabled(!enabled);
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Daily Reminder</CardTitle>
                {enabled ? <Bell className="h-4 w-4 text-blue-500" /> : <BellOff className="h-4 w-4 text-gray-500" />}
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Set a clear time to remind yourself to log expenses.
                    </p>
                    <div className="flex items-center gap-4">
                        <Input
                            type="time"
                            value={reminderTime}
                            onChange={(e) => setReminderTime(e.target.value)}
                            disabled={!enabled}
                        />
                        <Button
                            variant={enabled ? "default" : "outline"}
                            onClick={toggleEnabled}
                            className={enabled ? "bg-green-600 hover:bg-green-700" : ""}
                        >
                            {enabled ? "On" : "Off"}
                        </Button>
                    </div>
                    {enabled && (
                        <Button onClick={handleSave} className="w-full" size="sm">
                            Save Time
                        </Button>
                    )}
                    {permission === "denied" && (
                        <p className="text-xs text-red-500">
                            Notifications are blocked. Please enable them in your browser settings.
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
