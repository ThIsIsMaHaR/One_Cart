import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authDataContext } from './AuthContext'; // Matches the export above
import axios from 'axios';

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
    // We consume the auth context here
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
        <UserContext.Provider value={{ user, setUser, fetchUserProfile }}>
            {children}
        </UserContext.Provider>
    );
};