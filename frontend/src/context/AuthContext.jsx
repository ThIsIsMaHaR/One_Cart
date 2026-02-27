import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

export const authDataContext = createContext()

function AuthContextProvider({ children }) {
    const serverUrl = "https://e-comm-onecart-backend.onrender.com"; 
    const [token, setToken] = useState(localStorage.getItem('token') || '');

    // Function to handle Registration
    const registerUser = async (name, email, password) => {
        try {
            const response = await axios.post(`${serverUrl}/api/auth/registration`, 
                { name, email, password }, 
                { withCredentials: true }
            );
            if (response.data.success) {
                toast.success("Registration Successful");
                return response.data;
            }
        } catch (error) {
            console.error("Signup Error Details:", error);
            toast.error(error.response?.data?.message || "Registration Failed");
            throw error;
        }
    };

    // Function to handle Login
    const loginUser = async (email, password) => {
        try {
            const response = await axios.post(`${serverUrl}/api/auth/login`, 
                { email, password }, 
                { withCredentials: true }
            );
            if (response.data.success) {
                toast.success("Login Successful");
                return response.data;
            }
        } catch (error) {
            console.error("Login Error Details:", error);
            toast.error(error.response?.data?.message || "Login Failed");
            throw error;
        }
    };

    const value = {
        serverUrl,
        registerUser,
        loginUser,
        token,
        setToken
    }

    return (
        <authDataContext.Provider value={value}>
            {children}
        </authDataContext.Provider>
    )
}

export default AuthContextProvider