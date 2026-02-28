import React, { createContext, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

export const authDataContext = createContext()

function AuthContextProvider({ children }) {

    const serverUrl = "https://e-comm-onecart.onrender.com";

    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const registerUser = async (name, email, password) => {
        try {
            const response = await axios.post(
                `${serverUrl}/api/auth/registration`,
                { name, email: email.trim().toLowerCase(), password },
                { withCredentials: true }
            )

            if (response.data.success) {
                setIsLoggedIn(true)
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
                { email: email.trim().toLowerCase(), password },
                { withCredentials: true }
            )

            if (response.data.success) {
                setIsLoggedIn(true)
                toast.success("Login Successful")
                return response.data
            }

        } catch (error) {
            toast.error(error.response?.data?.message || "Login Failed")
            throw error
        }
    }

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