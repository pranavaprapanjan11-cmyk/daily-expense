import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'expo-router';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const router = useRouter();
    const theme = useTheme();

    const handleRegister = async () => {
        const trimmedName = name.trim();
        const trimmedEmail = email.trim();

        if (!trimmedName || !trimmedEmail || !password) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        if (password.length < 6) {
            Alert.alert("Error", "Password must be at least 6 characters");
            return;
        }

        // Basic email validation
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(trimmedEmail)) {
            Alert.alert("Error", "Please enter a valid email address");
            return;
        }

        setLoading(true);
        try {
            await register({
                username: trimmedName, // Assuming name maps to username in backend
                email: trimmedEmail,
                password
            });
            router.replace('/(tabs)');
        } catch (e: any) {
            const errorMsg = e.response?.data?.msg || "Email or Username might already exist";
            Alert.alert("Registration Failed", errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.header}>
                <Text variant="displaySmall" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                    Create Account
                </Text>
                <Text variant="bodyLarge" style={{ opacity: 0.7 }}>
                    Join the community of savers
                </Text>
            </View>

            <TextInput
                label="Full Name"
                value={name}
                onChangeText={setName}
                mode="outlined"
                style={styles.input}
            />
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
                onPress={handleRegister}
                loading={loading}
                style={styles.button}
                contentStyle={{ paddingVertical: 8 }}
            >
                Sign Up
            </Button>

            <Button
                mode="text"
                onPress={() => router.back()}
                style={styles.link}
            >
                Already have an account? Login
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
