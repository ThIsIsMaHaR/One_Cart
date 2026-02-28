import React, { createContext, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

export const authDataContext = createContext()

function AuthContextProvider({ children }) {
    // Ensure no trailing slash
    const serverUrl = "https://e-comm-onecart-backend.onrender.com"; 
    
    // With HTTP-only cookies, you don't actually need to store the token in state
    // but you might want an 'isAuthenticated' boolean instead.
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const registerUser = async (name, email, password) => {
        try {
            const response = await axios.post(`${serverUrl}/api/auth/registration`, 
                { name, email: email.toLowerCase(), password }, 
                { withCredentials: true }
            );
            if (response.data.success) {
                setIsLoggedIn(true);
                return response.data;
            }
        } catch (error) {
            console.error("Signup Error:", error.response || error);
            toast.error(error.response?.data?.message || "Registration Failed");
            throw error;
        }
    };

    const loginUser = async (email, password) => {
        try {
            const response = await axios.post(`${serverUrl}/api/auth/login`, 
                { email: email.toLowerCase(), password }, 
                { withCredentials: true }
            );
            if (response.data.success) {
                setIsLoggedIn(true);
                return response.data;
            }
        } catch (error) {
            console.error("Login Error:", error.response || error);
            toast.error(error.response?.data?.message || "Login Failed");
            throw error;
        }
    };

    const value = {
        serverUrl,
        registerUser,
        loginUser,
        isLoggedIn,
        setIsLoggedIn
    }

    return (
        <authDataContext.Provider value={value}>
            {children}
        </authDataContext.Provider>
    )
}

export default AuthContextProvider