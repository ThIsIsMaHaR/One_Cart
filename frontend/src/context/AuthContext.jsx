import React, { createContext } from 'react'

export const authDataContext = createContext()

function AuthContextProvider({ children }) {
    // UPDATED: The default now points to your LIVE Render URL
    // This ensures that even if the environment variable is missing, it talks to the right server.
    const serverUrl = import.meta.env.VITE_SERVER_URL || "https://onecart-62p0.onrender.com"

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