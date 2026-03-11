import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const adminDataContext = createContext();

// Axios default settings - Essential for cookies and sessions
axios.defaults.withCredentials = true;

const AdminContextProvider = (props) => {
    const [adminData, setAdminData] = useState(null);
    
    // Yahan hum Environment Variable use kar rahe hain. 
    // Vercel Settings mein VITE_API_URL zaroor add karna (e.g., https://your-app.onrender.com)
    const backendUrl = import.meta.env.VITE_API_URL || ""; 

    // 1. Admin Login Function
    const loginAdmin = async (email, password) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/auth/adminlogin`, 
                { email, password }
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
        // Agar backendUrl set nahi hai, toh call nahi bhejenge
        if (!backendUrl) return;

        try {
            const { data } = await axios.get(`${backendUrl}/api/auth/getadmin`);

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
            const { data } = await axios.post(`${backendUrl}/api/auth/logout`);
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