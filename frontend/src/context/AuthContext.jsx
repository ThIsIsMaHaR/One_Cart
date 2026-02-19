import React, { createContext } from 'react'

export const authDataContext = createContext()

function AuthContextProvider({ children }) {
    // This looks for an environment variable called VITE_SERVER_URL.
    // If it doesn't find one (like on your laptop), it defaults to localhost.
    const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8000"

    let value = {
        serverUrl
    }

    return (
        <authDataContext.Provider value={value}>
            {children}
        </authDataContext.Provider>
    )
}

export default AuthContextProvider