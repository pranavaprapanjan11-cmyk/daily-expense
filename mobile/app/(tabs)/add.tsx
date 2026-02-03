import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, HelperText, useTheme, Chip } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useExpenses } from '../../context/ExpenseContext';
import { CATEGORIES } from '../../lib/types';

export default function AddExpense() {
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [note, setNote] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);

    const { addExpense } = useExpenses();
    const router = useRouter();
    const theme = useTheme();

    const handleSubmit = async () => {
        if (!amount || isNaN(Number(amount))) {
            Alert.alert("Invalid Amount", "Please enter a valid number");
            return;
        }

        setLoading(true);
        try {
            await addExpense({
                amount: Number(amount),
                category,
                note,
                date,
            });
            setAmount('');
            setNote('');
            Alert.alert("Success", "Expense added successfully");
            router.push("/"); // Go to Dashboard
        } catch (e) {
            Alert.alert("Error", "Failed to add expense");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <TextInput
                label="Amount (₹)"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                style={styles.input}
                mode="outlined"
            />

            <Text variant="bodyLarge" style={styles.label}>Category</Text>
            <View style={styles.chipContainer}>
                {CATEGORIES.map((cat) => (
                    <Chip
                        key={cat}
                        selected={category === cat}
                        onPress={() => setCategory(cat)}
                        style={styles.chip}
                        showSelectedOverlay
                    >
                        {cat}
                    </Chip>
                ))}
            </View>

            <TextInput
                label="Date (YYYY-MM-DD)"
                value={date}
                onChangeText={setDate}
                style={styles.input}
                mode="outlined"
            />

            <TextInput
                label="Note (Optional)"
                value={note}
                onChangeText={setNote}
                style={styles.input}
                mode="outlined"
            />

            <Button
                mode="contained"
                onPress={handleSubmit}
                loading={loading}
                style={styles.button}
                contentStyle={{ paddingVertical: 8 }}
            >
                Add Expense
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    input: {
        marginBottom: 16,
    },
    label: {
        marginBottom: 8,
        marginTop: 8,
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 16,
    },
    chip: {
        marginRight: 8,
        marginBottom: 8,
    },
    button: {
        marginTop: 16,
    },
});
