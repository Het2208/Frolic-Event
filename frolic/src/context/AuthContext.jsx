import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const getInitialState = () => {
        const storedToken = localStorage.getItem('floric_token');
        const storedUser = localStorage.getItem('floric_user');
        
        if (storedToken && storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                return {
                    token: storedToken,
                    user: parsedUser,
                    role: parsedUser.role || null,
                };
            } catch (e) {
                console.error("Failed to parse user from local storage", e);
                return { token: null, user: null, role: null };
            }
        }
        return { token: null, user: null, role: null };
    };

    const initialState = getInitialState();
    
    const [user, setUser] = useState(initialState.user);
    const [token, setToken] = useState(initialState.token);
    const [role, setRole] = useState(initialState.role);

    const login = (newToken, newUser) => {
        setToken(newToken);
        setUser(newUser);
        setRole(newUser.role);
        
        localStorage.setItem('floric_token', newToken);
        localStorage.setItem('floric_user', JSON.stringify(newUser));
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        setRole(null);
        
        localStorage.removeItem('floric_token');
        localStorage.removeItem('floric_user');
    };

    const value = {
        user,
        token,
        role,
        login,
        logout,
        isAuthenticated: !!token
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
