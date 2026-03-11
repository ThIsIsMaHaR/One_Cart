import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

export const authDataContext = createContext()

// Axios default for all requests in this context
axios.defaults.withCredentials = true;

function AuthContextProvider({ children }) {

    // VITE_API_URL ko Vercel settings mein dalo (e.g. https://your-backend.onrender.com)
    // Agar environment variable nahi milta, toh ye fallback URL use karega
    const serverUrl = import.meta.env.VITE_API_URL || "https://e-comm-onecart.onrender.com";

    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userData, setUserData] = useState(null)

    const registerUser = async (name, email, password) => {
        try {
            const response = await axios.post(
                `${serverUrl}/api/auth/registration`,
                { name, email: email.trim().toLowerCase(), password }
            )

            if (response.data.success) {
                setIsLoggedIn(true)
                setUserData(response.data.user)
                toast.success("Registration Successful")
                return response.data
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration Failed")
            throw error
        }
    }

    const loginUser = async (email, password) => {
        try {
            const response = await axios.post(
                `${serverUrl}/api/auth/login`,
                { email: email.trim().toLowerCase(), password }
            )

            if (response.data.success) {
                setIsLoggedIn(true)
                setUserData(response.data.user)
                toast.success("Login Successful")
                return response.data
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Login Failed")
            throw error
        }
    }

    // Logout function bhi add kar di hai
    const logoutUser = async () => {
        try {
            await axios.post(`${serverUrl}/api/auth/logout`)
            setIsLoggedIn(false)
            setUserData(null)
            toast.success("Logged out")
        } catch (error) {
            toast.error("Logout failed")
        }
    }

    const value = {
        serverUrl,
        registerUser,
        loginUser,
        logoutUser,
        isLoggedIn,
        setIsLoggedIn,
        userData
    }

    return (
        <authDataContext.Provider value={value}>
            {children}
        </authDataContext.Provider>
    )
}

export default AuthContextProvider