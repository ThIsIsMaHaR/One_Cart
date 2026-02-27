import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { authDataContext } from './AuthContext'
import axios from 'axios'

export const userDataContext = createContext()

function UserContext({ children }) {
    const [userData, setUserData] = useState(null)
    const [loading, setLoading] = useState(true) 
    const { serverUrl } = useContext(authDataContext)

    // Using useCallback to prevent the function from being recreated on every render
    const getCurrentUser = useCallback(async () => {
        // Don't fetch if serverUrl isn't ready yet
        if (!serverUrl) return;

        try {
            setLoading(true)
            // withCredentials is now handled globally in App.jsx, 
            // but keeping it here for safety is fine.
            const { data } = await axios.get(`${serverUrl}/api/user/getcurrentuser`)
            
            if (data.success) {
                setUserData(data.user)
            } else {
                setUserData(null)
            }
        } catch (error) {
            setUserData(null)
            // Only log actual errors, not 401 (Unauthorized) which is expected if not logged in
            if (error.response?.status !== 401) {
                console.error("User Profile Fetch Error:", error.response?.data?.message || error.message)
            }
        } finally {
            setLoading(false)
        }
    }, [serverUrl])

    useEffect(() => {
        // Trigger fetch only when serverUrl is officially loaded from AuthContext
        if (serverUrl) {
            getCurrentUser()
        } else {
            // If there's no URL, we can't be loading data
            setLoading(false)
        }
    }, [serverUrl, getCurrentUser])

    const value = {
        userData,
        setUserData,
        getCurrentUser,
        loading 
    }

    return (
        <userDataContext.Provider value={value}>
            {children}
        </userDataContext.Provider>
    )
}

export default UserContext