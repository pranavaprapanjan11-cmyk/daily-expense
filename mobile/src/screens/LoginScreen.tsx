import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, TextInput, Button, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { setUserId } from '../lib/api';

export default function LoginScreen() {
    const [userId, setInputUserId] = useState('');
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation<any>();
    const theme = useTheme();

    const handleLogin = async () => {
        if (!userId.trim()) {
            Alert.alert("Required", "Please enter a User ID/Number.");
            return;
        }

        setLoading(true);
        try {
            await setUserId(userId.trim());
            // Navigate to main tabs effectively logging in
            navigation.reset({
                index: 0,
                routes: [{ name: 'MainTabs' }],
            });
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to save User ID.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.content}>
                <Text variant="headlineMedium" style={{ color: theme.colors.primary, marginBottom: 8, fontWeight: 'bold' }}>
                    Welcome
                </Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 32 }}>
                    Enter a unique User ID (e.g., your phone number) to sync your expenses across devices.
                </Text>

                <TextInput
                    label="User ID / Secret Number"
                    value={userId}
                    onChangeText={setInputUserId}
                    mode="outlined"
                    keyboardType="numeric"
                    style={{ marginBottom: 24 }}
                    autoCapitalize="none"
                />

                <Button
                    mode="contained"
                    onPress={handleLogin}
                    loading={loading}
                    disabled={loading}
                    contentStyle={{ paddingVertical: 8 }}
                >
                    Continue
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
    },
    content: {
        maxWidth: 400,
        width: '100%',
        alignSelf: 'center',
    }
});
