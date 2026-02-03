import React from 'react';
import { ScrollView, View, StyleSheet, Dimensions } from 'react-native';
import { Text, Card, ActivityIndicator, useTheme } from 'react-native-paper';
import { PieChart } from 'react-native-chart-kit';
import { useExpenses } from '../../context/ExpenseContext';

const screenWidth = Dimensions.get("window").width;

const CHART_CONFIG = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
};

// Colors for pie chart segments
const COLORS = ['#e11d48', '#2563eb', '#16a34a', '#d97706', '#9333ea', '#57534e'];

export default function Dashboard() {
    const { expenses, summary, loading } = useExpenses();
    const theme = useTheme();

    const today = new Date().toISOString().split('T')[0];
    const thisMonth = new Date().toISOString().slice(0, 7);

    const todayTotal = expenses
        .filter(e => e.date === today)
        .reduce((acc, curr) => acc + curr.amount, 0);

    const monthlyTotal = expenses
        .filter(e => e.date.startsWith(thisMonth))
        .reduce((acc, curr) => acc + curr.amount, 0);

    const pieData = summary.map((item, index) => ({
        name: item.category,
        population: item.total,
        color: COLORS[index % COLORS.length],
        legendFontColor: theme.colors.onSurfaceVariant,
        legendFontSize: 12,
    }));

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text variant="headlineMedium" style={[styles.header, { color: theme.colors.onSurface }]}>
                Dashboard
            </Text>

            {/* Stats Section */}
            <View style={styles.statsRow}>
                <Card style={[styles.halfCard, { backgroundColor: theme.colors.surfaceVariant }]}>
                    <Card.Content>
                        <Text variant="labelMedium" style={{ color: theme.colors.primary }}>Today</Text>
                        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface }}>
                            ₹{todayTotal.toFixed(0)}
                        </Text>
                    </Card.Content>
                </Card>
                <Card style={[styles.halfCard, { backgroundColor: theme.colors.surfaceVariant }]}>
                    <Card.Content>
                        <Text variant="labelMedium" style={{ color: theme.colors.primary }}>Monthly</Text>
                        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface }}>
                            ₹{monthlyTotal.toFixed(0)}
                        </Text>
                    </Card.Content>
                </Card>
            </View>

            {/* Pie Chart */}
            <Card style={styles.card}>
                <Card.Title title="Spending Distribution" titleVariant="titleMedium" />
                <Card.Content>
                    {summary.length > 0 ? (
                        <PieChart
                            data={pieData}
                            width={screenWidth - 64}
                            height={200}
                            chartConfig={{
                                color: (opacity = 1) => theme.colors.primary,
                            }}
                            accessor={"population"}
                            backgroundColor={"transparent"}
                            paddingLeft={"15"}
                            absolute
                        />
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Text variant="bodyMedium">No expenses logged yet</Text>
                        </View>
                    )}
                </Card.Content>
            </Card>

            {/* Recent Transactions Preview */}
            <View style={styles.section}>
                <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                    Recent Transactions
                </Text>
                {expenses.length === 0 ? (
                    <Text variant="bodySmall" style={{ textAlign: 'center', opacity: 0.6 }}>Add your first expense!</Text>
                ) : (
                    expenses.slice(0, 5).map((expense) => (
                        <Card key={expense.id} style={styles.expenseItem}>
                            <Card.Content style={styles.expenseContent}>
                                <View>
                                    <Text variant="titleSmall">{expense.category}</Text>
                                    <Text variant="bodySmall" style={{ opacity: 0.7 }}>
                                        {new Date(expense.date).toLocaleDateString()}
                                    </Text>
                                </View>
                                <Text variant="titleMedium" style={{ color: theme.colors.error }}>
                                    -₹{expense.amount}
                                </Text>
                            </Card.Content>
                        </Card>
                    ))
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        marginBottom: 20,
        fontWeight: 'bold',
        paddingTop: 40,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    halfCard: {
        width: '48%',
    },
    card: {
        marginBottom: 16,
        elevation: 2,
    },
    section: {
        marginTop: 8,
        marginBottom: 40,
    },
    sectionTitle: {
        marginBottom: 12,
        fontWeight: '600',
    },
    expenseItem: {
        marginBottom: 10,
    },
    expenseContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    emptyContainer: {
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
