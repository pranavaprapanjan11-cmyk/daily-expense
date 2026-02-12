import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { List, Switch, Divider, Text, useTheme } from 'react-native-paper';
import { Storage } from '../lib/storage';

export default function SettingsScreen() {
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const theme = useTheme();

    useEffect(() => {
        checkPermission();
    }, []);

    const checkPermission = async () => {
        // Notifications disabled for stabilization
        setNotificationsEnabled(false);
    };

    const toggleNotifications = async () => {
        Alert.alert("Notice", "Reminders are temporarily disabled for app stability.");
    };

    const scheduleNotification = async () => {
        // Disabled
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
                <Text variant="labelSmall" style={{ color: theme.colors.surfaceVariant, marginTop: 4 }}>
                    Device-Based Storage
                </Text>
            </View>
        </View >
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
