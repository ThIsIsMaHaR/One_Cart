import React, { createContext, useContext, useEffect, useState } from 'react'
import { authDataContext } from './AuthContext'
import axios from 'axios'

export const userDataContext = createContext()

function UserContext({ children }) {
    const [userData, setUserData] = useState(null)
    const { serverUrl } = useContext(authDataContext)

    const getCurrentUser = async () => {
        try {
            // Check if serverUrl exists to avoid "undefined/api/..." errors
            if (!serverUrl) return;

            const result = await axios.get(`${serverUrl}/api/user/getcurrentuser`, { withCredentials: true })
            setUserData(result.data)
        } catch (error) {
            setUserData(null)
            console.error("Context User Fetch Error:", error)
        }
    }

    useEffect(() => {
        if (serverUrl) {
            getCurrentUser()
        }
    }, [serverUrl]) // Runs when serverUrl is ready

    const value = {
        userData,
        setUserData,
        getCurrentUser
    }

    return (
        <userDataContext.Provider value={value}>
            {children}
        </userDataContext.Provider>
    )
}

export default UserContext