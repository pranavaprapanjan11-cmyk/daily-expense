import React from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { Text, Card, IconButton, useTheme } from 'react-native-paper';
import { useExpenses } from '../../context/ExpenseContext';

export default function History() {
    const { expenses, deleteExpense } = useExpenses();
    const theme = useTheme();

    const handleDelete = (id: string) => {
        Alert.alert(
            "Delete Expense",
            "Are you sure you want to delete this expense?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => deleteExpense(id)
                }
            ]
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <FlatList
                data={expenses}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Card style={styles.card}>
                        <Card.Content style={styles.content}>
                            <View style={styles.left}>
                                <Text variant="titleMedium">{item.category}</Text>
                                <Text variant="bodySmall" style={{ color: theme.colors.secondary }}>
                                    {new Date(item.date).toDateString()}
                                </Text>
                                {item.note ? <Text variant="bodySmall" style={{ fontStyle: 'italic' }}>{item.note}</Text> : null}
                            </View>
                            <View style={styles.right}>
                                <Text variant="titleMedium" style={{ color: theme.colors.error, marginRight: 8 }}>
                                    -₹{item.amount}
                                </Text>
                                <IconButton
                                    icon="trash-can-outline"
                                    size={20}
                                    onPress={() => handleDelete(item.id)}
                                />
                            </View>
                        </Card.Content>
                    </Card>
                )}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text>No history yet.</Text>
                    </View>
                }
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    card: {
        marginBottom: 12,
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    left: {
        flex: 1,
    },
    right: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    empty: {
        alignItems: 'center',
        marginTop: 40,
    },
});
