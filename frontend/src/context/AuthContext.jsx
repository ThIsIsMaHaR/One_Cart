import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// CRITICAL: This must be exported exactly as 'authDataContext'
export const authDataContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [userData, setUserData] = useState(null);
    
    // Replace with your actual backend URL
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
        <authDataContext.Provider value={{ token, login, logout, backendUrl, userData, setUserData }}>
            {children}
        </authDataContext.Provider>
    );
};