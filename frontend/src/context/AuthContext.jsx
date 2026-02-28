import React, { createContext, useState } from 'react';

export const authDataContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const backendUrl = "https://e-comm-onecart-backend.onrender.com";

    const login = (newToken) => {
        setToken(newToken);
        localStorage.setItem('token', newToken);
    };

    const logout = () => {
        setToken(null);
        localStorage.removeItem('token');
    };

    return (
        <authDataContext.Provider value={{ token, login, logout, backendUrl }}>
            {children}
        </authDataContext.Provider>
    );
};