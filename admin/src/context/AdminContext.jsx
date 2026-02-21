import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const adminDataContext = createContext();

const AdminContextProvider = (props) => {
    const [adminData, setAdminData] = useState(null);
    
    // Absolute URL for the Backend
    const backendUrl = "https://onecart-62p0.onrender.com";

    // 1. Admin Login Function (Add this here!)
    const loginAdmin = async (email, password) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/auth/adminlogin`, 
                { email, password }, 
                { withCredentials: true }
            );

            if (data.success) {
                setAdminData(data.adminData); // Match the 'adminData' key from our new controller
                toast.success("Welcome, Admin!");
                return true;
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Login Failed";
            toast.error(errorMsg);
            return false;
        }
    };

    // 2. Function to fetch Admin Profile
    const getAdmin = async () => {
        try {
            // Check if your route is /api/auth or /api/user
            const { data } = await axios.get(`${backendUrl}/api/auth/getadmin`, { 
                withCredentials: true 
            });

            if (data.success) {
                setAdminData(data.admin || data.adminData);
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
            const { data } = await axios.post(`${backendUrl}/api/auth/logOut`, {}, { 
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
        loginAdmin, // Now you can call this from your Login.jsx
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