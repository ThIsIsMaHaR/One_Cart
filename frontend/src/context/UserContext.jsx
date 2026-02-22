import React, { createContext, useContext, useEffect, useState } from 'react'
import { authDataContext } from './AuthContext'
import axios from 'axios'

export const userDataContext = createContext()

function UserContext({ children }) {
    const [userData, setUserData] = useState(null)
    const [loading, setLoading] = useState(true) 
    const { serverUrl } = useContext(authDataContext)

    const getCurrentUser = async () => {
        try {
            setLoading(true)
            // Use relative path if serverUrl is empty
            const baseUrl = serverUrl || ""

            const result = await axios.get(`${baseUrl}/api/user/getcurrentuser`, { 
                withCredentials: true 
            })
            
            // Sync with backend: result.data.user
            if (result.data && result.data.success) {
                setUserData(result.data.user)
            } else {
                setUserData(null)
            }
        } catch (error) {
            setUserData(null);
            console.error("Context User Fetch Error:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (typeof serverUrl === 'string') {
            getCurrentUser()
        }
    }, [serverUrl])

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