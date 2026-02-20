import React, { createContext, useContext, useEffect, useState } from 'react'
import { authDataContext } from './AuthContext'
import axios from 'axios'

export const userDataContext = createContext()

function UserContext({ children }) {
    const [userData, setUserData] = useState(null)
    // Add a loading state to prevent premature redirects
    const [loading, setLoading] = useState(true) 
    const { serverUrl } = useContext(authDataContext)

    const getCurrentUser = async () => {
        try {
            // If serverUrl is not yet defined, we can't fetch
            if (serverUrl === undefined) return;

            const result = await axios.get(`${serverUrl}/api/user/getcurrentuser`, { 
                withCredentials: true 
            })
            
            if (result.data) {
                setUserData(result.data)
            } else {
                setUserData(null)
            }
        } catch (error) {
            setUserData(null)
            console.error("Context User Fetch Error:", error)
        } finally {
            // Whether success or error, we are done loading
            setLoading(false)
        }
    }

    useEffect(() => {
        // Only fetch if serverUrl is a string (even if empty string "")
        if (typeof serverUrl === 'string') {
            getCurrentUser()
        }
    }, [serverUrl])

    const value = {
        userData,
        setUserData,
        getCurrentUser,
        loading // Export loading so components know when to wait
    }

    return (
        <userDataContext.Provider value={value}>
            {children}
        </userDataContext.Provider>
    )
}

export default UserContext