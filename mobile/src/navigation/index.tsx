import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';

import DashboardScreen from '../screens/DashboardScreen';
import AddExpenseScreen from '../screens/AddExpenseScreen';
import HistoryScreen from '../screens/HistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
    const theme = useTheme();
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName: any;
                    if (route.name === 'Dashboard') iconName = 'view-dashboard';
                    else if (route.name === 'Add') iconName = 'plus-circle';
                    else if (route.name === 'History') iconName = 'history';
                    else if (route.name === 'Settings') iconName = 'cog';
                    return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.outline,
                headerStyle: { backgroundColor: theme.colors.surface },
                headerTintColor: theme.colors.onSurface,
            })}
        >
            <Tab.Screen name="Dashboard" component={DashboardScreen} />
            <Tab.Screen name="Add" component={AddExpenseScreen} options={{ title: 'Add Expense' }} />
            <Tab.Screen name="History" component={HistoryScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
    );
}

export default function RootNavigator() {
    // NO LOGIN - Direct to main app
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="MainTabs"
                screenOptions={{ headerShown: false }}
            >
                <Stack.Screen name="MainTabs" component={MainTabs} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
