import { Tabs } from 'expo-router';
import { LayoutDashboard, PlusCircle, History, Settings } from 'lucide-react-native';
import { useTheme } from 'react-native-paper';

export default function TabLayout() {
    const theme = useTheme();

    return (
        <Tabs
            screenOptions={{
                headerShown: true,
                headerStyle: { backgroundColor: theme.colors.surface },
                headerTintColor: theme.colors.onSurface,
                tabBarStyle: { backgroundColor: theme.colors.surface },
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.outline,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Dashboard',
                    tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="add"
                options={{
                    title: 'Add Expense',
                    tabBarIcon: ({ color, size }) => <PlusCircle color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    title: 'History',
                    tabBarIcon: ({ color, size }) => <History color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />,
                }}
            />
        </Tabs>
    );
}
