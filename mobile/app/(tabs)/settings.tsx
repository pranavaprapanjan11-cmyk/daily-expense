import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import { List, Switch, Button, Divider, Text, useTheme } from 'react-native-paper';
import * as Notifications from 'expo-notifications';
import { Storage } from '../../lib/storage';
import { useExpenses } from '../../context/ExpenseContext';

// Configure notifications handler
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    } as Notifications.NotificationBehavior),
});

export default function Settings() {
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const theme = useTheme();

    useEffect(() => {
        checkPermission();
    }, []);

    const checkPermission = async () => {
        const { status } = await Notifications.getPermissionsAsync();
        setNotificationsEnabled(status === 'granted');
    };

    const toggleNotifications = async () => {
        if (notificationsEnabled) {
            // Disable means canceling all
            await Notifications.cancelAllScheduledNotificationsAsync();
            setNotificationsEnabled(false);
            Alert.alert("Notifications", "Daily reminders disabled.");
        } else {
            // Enable
            const { status } = await Notifications.requestPermissionsAsync();
            if (status === 'granted') {
                await scheduleNotification();
                setNotificationsEnabled(true);
                Alert.alert("Notifications", "Daily reminder set for 8:00 PM!");
            } else {
                Alert.alert("Permission", "Notification permission denied.");
            }
        }
    };

    const scheduleNotification = async () => {
        await Notifications.cancelAllScheduledNotificationsAsync();
        await Notifications.scheduleNotificationAsync({
            content: {
                title: " 📝 Daily Expense Reminder",
                body: "Don't forget to track your expenses for today!",
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DAILY,
                hour: 20,
                minute: 0,
            } as Notifications.DailyTriggerInput,
        });
    };

    const handleClearData = () => {
        Alert.alert(
            "Reset Data",
            "This will permanently delete all your expense data. This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete All",
                    style: "destructive",
                    onPress: async () => {
                        await Storage.clear();
                        // In a real app we'd reload the context, but simpler here to just alert
                        Alert.alert("Reset", "Data cleared. Please restart the app.");
                    }
                }
            ]
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <List.Section>
                <List.Subheader>Preferences</List.Subheader>
                <List.Item
                    title="Daily Reminder (8 PM)"
                    description="Get notified to add expenses"
                    left={() => <List.Icon icon="bell" />}
                    right={() => <Switch value={notificationsEnabled} onValueChange={toggleNotifications} />}
                />
            </List.Section>

            <Divider />

            <List.Section>
                <List.Subheader>Data Management</List.Subheader>
                <List.Item
                    title="Clear All Data"
                    description="Delete all expenses from device"
                    left={() => <List.Icon icon="delete" color={theme.colors.error} />}
                    onPress={handleClearData}
                />
            </List.Section>

            <View style={styles.footer}>
                <Text variant="bodySmall" style={{ color: theme.colors.secondary }}>
                    Just One Tea v1.0.0
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    footer: {
        padding: 16,
        alignItems: 'center',
        marginTop: 'auto',
    },
});
