import React, { useState } from 'react';
import { View, StyleSheet, Alert, Image } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'expo-router';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();
    const theme = useTheme();

    const handleLogin = async () => {
        const trimmedEmail = email.trim();
        if (!trimmedEmail || !password) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }
        setLoading(true);
        try {
            await login({
                email: trimmedEmail,
                password
            });
            router.replace('/(tabs)');
        } catch (e: any) {
            const errorMsg = e.response?.data?.msg || "Invalid credentials or server error";
            Alert.alert("Login Failed", errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.header}>
                <Text variant="displaySmall" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                    Welcome back
                </Text>
                <Text variant="bodyLarge" style={{ opacity: 0.7 }}>
                    Login to sync your expenses
                </Text>
            </View>

            <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
            />
            <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                secureTextEntry
                style={styles.input}
            />

            <Button
                mode="contained"
                onPress={handleLogin}
                loading={loading}
                style={styles.button}
                contentStyle={{ paddingVertical: 8 }}
            >
                Login
            </Button>

            <Button
                mode="text"
                onPress={() => router.push('/register')}
                style={styles.link}
            >
                Don't have an account? Sign up
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    header: {
        marginBottom: 40,
    },
    input: {
        marginBottom: 16,
    },
    button: {
        marginTop: 10,
    },
    link: {
        marginTop: 10,
    }
});
