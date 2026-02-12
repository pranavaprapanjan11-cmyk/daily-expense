import React from 'react';
import { ScrollView, View, StyleSheet, Dimensions, RefreshControl } from 'react-native';
import { Text, Card, ActivityIndicator, useTheme } from 'react-native-paper';
import { PieChart } from 'react-native-chart-kit';
import { useExpenses } from '../context/ExpenseContext';

const screenWidth = Dimensions.get("window").width;

const CHART_CONFIG = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
};

// Colors for pie chart segments
const COLORS = ['#e11d48', '#2563eb', '#16a34a', '#d97706', '#9333ea', '#57534e'];

export default function DashboardScreen() {
    const { expenses, summary, loading, refreshExpenses } = useExpenses();
    const theme = useTheme();
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await refreshExpenses();
        setRefreshing(false);
    }, []);

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

    if (loading && !refreshing && expenses.length === 0) {
        return (
            <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: theme.colors.background }]}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
            }
        >
            <View style={styles.headerContainer}>
                <Text variant="headlineMedium" style={{ color: theme.colors.onSurface, fontWeight: 'bold' }}>
                    Dashboard
                </Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.secondary }}>
                    Overview
                </Text>
            </View>

            {/* Stats Section */}
            <View style={styles.statsRow}>
                <Card style={[styles.statsCard, { backgroundColor: theme.colors.primaryContainer }]}>
                    <Card.Content>
                        <Text variant="labelMedium" style={{ color: theme.colors.onPrimaryContainer, opacity: 0.7 }}>Today</Text>
                        <Text variant="headlineSmall" style={{ color: theme.colors.onPrimaryContainer, fontWeight: 'bold' }}>
                            ₹{todayTotal.toFixed(0)}
                        </Text>
                    </Card.Content>
                </Card>
                <Card style={[styles.statsCard, { backgroundColor: theme.colors.secondaryContainer }]}>
                    <Card.Content>
                        <Text variant="labelMedium" style={{ color: theme.colors.onSecondaryContainer, opacity: 0.7 }}>Monthly</Text>
                        <Text variant="headlineSmall" style={{ color: theme.colors.onSecondaryContainer, fontWeight: 'bold' }}>
                            ₹{monthlyTotal.toFixed(0)}
                        </Text>
                    </Card.Content>
                </Card>
            </View>

            {/* Pie Chart */}
            <Card style={styles.chartCard}>
                <Card.Title title="Spending Distribution" titleVariant="titleMedium" />
                <Card.Content>
                    {summary.length > 0 ? (
                        <PieChart
                            data={pieData}
                            width={screenWidth - 48}
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
                            <Text variant="bodyMedium" style={{ color: theme.colors.secondary }}>No data to show</Text>
                        </View>
                    )}
                </Card.Content>
            </Card>

            {/* Recent Transactions Preview */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                        Recent Transactions
                    </Text>
                </View>

                {expenses.length === 0 ? (
                    <Card style={styles.emptyCard}>
                        <Card.Content style={styles.centerAPI}>
                            <Text variant="bodyMedium" style={{ color: theme.colors.secondary }}>No expenses logged yet.</Text>
                            <Text variant="bodySmall" style={{ color: theme.colors.primary, marginTop: 4 }}>Add your first expense!</Text>
                        </Card.Content>
                    </Card>
                ) : (
                    expenses.slice(0, 5).map((expense) => (
                        <Card key={expense.id} style={styles.expenseItem} mode="elevated">
                            <Card.Content style={styles.expenseContent}>
                                <View style={styles.expenseLeft}>
                                    <View style={[styles.categoryIcon, { backgroundColor: theme.colors.surfaceVariant }]}>
                                        <Text style={{ fontSize: 16 }}>
                                            {expense.category === 'Food' ? '🍔' :
                                                expense.category === 'Travel' ? '🚕' :
                                                    expense.category === 'Education' ? '🎓' :
                                                        expense.category === 'Personal' ? '👤' :
                                                            '📝'}
                                        </Text>
                                    </View>
                                    <View>
                                        <Text variant="titleSmall" style={{ fontWeight: '500' }}>{expense.category}</Text>
                                        <Text variant="bodySmall" style={{ color: theme.colors.secondary }}>
                                            {expense.note || new Date(expense.date).toLocaleDateString()}
                                        </Text>
                                    </View>
                                </View>
                                <Text variant="titleMedium" style={{ color: theme.colors.error, fontWeight: 'bold' }}>
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
    headerContainer: {
        marginTop: 40, // Reduced for non-tabs header if needed
        marginBottom: 24,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centerAPI: {
        alignItems: 'center',
        padding: 20,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    statsCard: {
        width: '48%',
        borderRadius: 16,
        elevation: 2,
    },
    chartCard: {
        marginBottom: 24,
        borderRadius: 16,
        elevation: 2,
        overflow: 'hidden',
    },
    section: {
        marginBottom: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    expenseItem: {
        marginBottom: 12,
        borderRadius: 12,
        elevation: 1,
    },
    expenseContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    expenseLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    categoryIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyCard: {
        borderRadius: 12,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: 'transparent',
        elevation: 0,
    },
});
