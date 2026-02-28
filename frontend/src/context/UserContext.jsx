import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authDataContext } from './AuthContext';
import axios from 'axios';

// Changed 'UserContext' to 'userDataContext' to match your Registration.jsx import
export const userDataContext = createContext();

export const UserContextProvider = ({ children }) => {
    const { token, backendUrl } = useContext(authDataContext);
    const [user, setUser] = useState(null);

    const fetchUserProfile = useCallback(async () => {
        if (!token) return;
        try {
            const response = await axios.get(`${backendUrl}/api/user/profile`, {
                headers: { token }
            });
            if (response.data.success) {
                setUser(response.data.user);
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    }, [token, backendUrl]);

    useEffect(() => {
        fetchUserProfile();
    }, [fetchUserProfile]);

    return (
        <userDataContext.Provider value={{ user, setUser, fetchUserProfile }}>
            {children}
        </userDataContext.Provider>
    );
};