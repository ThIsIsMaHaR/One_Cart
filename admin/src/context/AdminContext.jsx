import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const adminDataContext = createContext();

const AdminContextProvider = (props) => {
    const [adminData, setAdminData] = useState(null);
    
    // --- THE FIX ---
    // If the Admin is served from the same Render service, we use an empty string.
    // This forces the request to stay on the same domain (No CORS issues!).
    const backendUrl = ""; 

    // 1. Admin Login Function
    const loginAdmin = async (email, password) => {
        try {
            // Note: URL becomes "/api/auth/adminlogin"
            const { data } = await axios.post(`${backendUrl}/api/auth/adminlogin`, 
                { email, password }, 
                { withCredentials: true }
            );

            if (data.success) {
                setAdminData(data.adminData); 
                toast.success("Welcome, Admin!");
                return true;
            }
        } catch (error) {
            console.error("Login detail:", error);
            const errorMsg = error.response?.data?.message || "Login Failed";
            toast.error(errorMsg);
            return false;
        }
    };

    // 2. Function to fetch Admin Profile
    const getAdmin = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/auth/getadmin`, { 
                withCredentials: true 
            });

            if (data.success) {
                setAdminData(data.adminData);
            } else {
                setAdminData(null);
            }
        } catch (error) {
            console.log("Admin session not found");
            setAdminData(null);
        }
    };

    // 3. Logout Function
    const logoutAdmin = async () => {
        try {
            // Updated to /api/auth/logout (lowercase 'o' to match our authRoutes.js)
            const { data } = await axios.post(`${backendUrl}/api/auth/logout`, {}, { 
                withCredentials: true 
            });
            if (data.success) {
                setAdminData(null);
                toast.success("Logged out successfully");
            }
        } catch (error) {
            toast.error("Logout failed");
        }
    };

    useEffect(() => {
        getAdmin();
    }, []);

    const value = {
        adminData,
        setAdminData,
        loginAdmin,
        getAdmin,
        logoutAdmin,
        backendUrl 
    };

    return (
        <adminDataContext.Provider value={value}>
            {props.children}
        </adminDataContext.Provider>
    );
};

export default AdminContextProvider;