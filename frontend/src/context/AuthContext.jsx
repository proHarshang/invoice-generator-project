import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL;

// Create Context
const AuthContext = createContext();

// Create a provider for the context
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Load user from localStorage if available
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser); // Try parsing the stored user data
                setUser(parsedUser);
            }
        } catch (error) {
            console.error("Error reading from localStorage:", error); // Log the error
            localStorage.removeItem('user'); // Remove corrupted data if any
        }
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${BASE_URL}/login`, { email, password });
            const userData = response.data;
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData)); // Save to localStorage
            return { success: true };
        } catch (error) {
            console.error("Login error:", error);
            return { success: false, message: error.response.data.message };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user'); // Remove from localStorage
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);
