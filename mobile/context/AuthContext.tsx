import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthAPI } from '../lib/api';

type AuthContextType = {
    token: string | null;
    isAuthenticated: boolean;
    login: (credentials: any) => Promise<void>;
    register: (userData: any) => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadToken = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('token');
                if (storedToken) {
                    // Pre-emptively set token so interceptor can use it
                    setToken(storedToken);
                    try {
                        await AuthAPI.verifyToken();
                    } catch (e) {
                        // Token invalid/expired
                        await AsyncStorage.removeItem('token');
                        setToken(null);
                    }
                }
            } catch (e) {
                console.error("Failed to load token", e);
            } finally {
                setLoading(false);
            }
        };
        loadToken();
    }, []);

    const login = async (credentials: any) => {
        const res = await AuthAPI.login(credentials);
        setToken(res.token);
    };

    const register = async (userData: any) => {
        const res = await AuthAPI.register(userData);
        setToken(res.token);
    };

    const logout = async () => {
        try {
            await AuthAPI.logout();
        } finally {
            setToken(null);
        }
    };

    return (
        <AuthContext.Provider value={{ token, isAuthenticated: !!token, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
