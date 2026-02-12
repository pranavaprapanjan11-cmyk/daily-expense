import React, { useEffect } from 'react';
import { Provider as PaperProvider, MD3LightTheme } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import RootNavigator from './src/navigation';
import { ExpenseProvider } from './src/context/ExpenseContext';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync().catch(() => {
    /* reloading the app might cause this to error, so we catch it */
});

export default function App() {
    useEffect(() => {
        // Hide splash screen after 1 second to ensure everything is ready
        const timer = setTimeout(async () => {
            await SplashScreen.hideAsync().catch(() => { });
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <PaperProvider theme={MD3LightTheme}>
                <ExpenseProvider>
                    <RootNavigator />
                </ExpenseProvider>
            </PaperProvider>
        </GestureHandlerRootView>
    );
}
