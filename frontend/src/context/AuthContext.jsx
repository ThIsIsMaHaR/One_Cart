import React, { createContext } from 'react'

export const authDataContext = createContext()

function AuthContextProvider({ children }) {
    const serverUrl = ""; 

    const value = {
        serverUrl
    }

    return (
        <authDataContext.Provider value={value}>
            {children}
        </authDataContext.Provider>
    )
}

export default AuthContextProvider