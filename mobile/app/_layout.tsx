import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from "expo-router";
import { PaperProvider, MD3DarkTheme } from 'react-native-paper';
import { AuthProvider } from "../context/AuthContext";
import { ExpenseProvider } from "../context/ExpenseContext";
import { StatusBar } from "expo-status-bar";
import { registerForPushNotificationsAsync, scheduleDailyReminder } from "../lib/notifications";
import { useAuth } from "../context/AuthContext";

const theme = {
    ...MD3DarkTheme,
    colors: {
        ...MD3DarkTheme.colors,
        primary: '#3b82f6',
        secondary: '#94a3b8',
    },
};



export default function RootLayout() {
    return (
        <PaperProvider theme={theme}>
            <AuthProvider>
                <ExpenseProvider>
                    <RootLayoutNavigation />
                    <StatusBar style="light" />
                </ExpenseProvider>
            </AuthProvider>
        </PaperProvider>
    );
}

function RootLayoutNavigation() {
    const { isAuthenticated, loading } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;

        const inAuthGroup = segments[0] === '(tabs)';

        if (!isAuthenticated && inAuthGroup) {
            router.replace('/login');
        } else if (isAuthenticated && !inAuthGroup) {
            router.replace('/(tabs)');
        }
    }, [isAuthenticated, segments, loading]);

    useEffect(() => {
        const setup = async () => {
            await registerForPushNotificationsAsync();
            await scheduleDailyReminder();
        };
        setup();
    }, []);

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />
            <Stack.Screen name="(tabs)" />
        </Stack>
    );
}
