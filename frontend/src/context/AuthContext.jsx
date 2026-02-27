import React, { createContext } from 'react'

export const authDataContext = createContext()

function AuthContextProvider({ children }) {
    // REPLACE the empty string with your live Render backend URL
    // It should look something like: "https://one-cart-backend.onrender.com"
    const serverUrl = "https://e-comm-onecart-backend.onrender.com"; 

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