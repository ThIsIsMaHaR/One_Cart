import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { authDataContext } from './AuthContext'
import axios from 'axios'

export const userDataContext = createContext()

function UserContext({ children }) {
    const [userData, setUserData] = useState(null)
    const [loading, setLoading] = useState(true) 
    const { serverUrl } = useContext(authDataContext)

    const getCurrentUser = useCallback(async () => {
        if (!serverUrl) return;

        try {
            setLoading(true)
            // FIXED: Added withCredentials and ensured clean URL
            const baseUrl = serverUrl.endsWith('/') ? serverUrl.slice(0, -1) : serverUrl;
            
            const { data } = await axios.get(`${baseUrl}/api/user/getcurrentuser`, {
                withCredentials: true
            })
            
            if (data.success) {
                setUserData(data.user)
            } else {
                setUserData(null)
            }
        } catch (error) {
            setUserData(null)
            if (error.response?.status !== 401) {
                console.error("User Profile Fetch Error:", error.response?.data?.message || error.message)
            }
        } finally {
            setLoading(false)
        }
    }, [serverUrl])

    useEffect(() => {
        if (serverUrl) {
            getCurrentUser()
        } else {
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