import React, { createContext, useState } from 'react';

export const userDataContext = createContext();

export const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    return (
        <userDataContext.Provider value={{ user, setUser }}>
            {children}
        </userDataContext.Provider>
    );
};