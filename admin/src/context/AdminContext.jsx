import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const adminDataContext = createContext();

const AdminContextProvider = (props) => {
    const [adminData, setAdminData] = useState(null);
    
    // 🔥 CRITICAL: Using the absolute URL prevents the "/admin/api/..." 404 error
    const backendUrl = "https://onecart-62p0.onrender.com";

    // Function to fetch Admin Profile/Data
    const getAdmin = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/getadmin`, { 
                withCredentials: true 
            });

            if (data.success) {
                setAdminData(data.admin);
            } else {
                setAdminData(null);
            }
        } catch (error) {
            // If it's a 401/404, just reset adminData without spamming logs
            console.log("Admin Fetch Error (Not logged in):", error.response?.status || error.message);
            setAdminData(null);
        }
    };

    // Logout Function
    const logoutAdmin = async () => {
        try {
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

    // Auto-fetch admin data on refresh
    useEffect(() => {
        getAdmin();
    }, []);

    const value = {
        adminData,
        setAdminData,
        getAdmin,
        logoutAdmin,
        backendUrl // We pass this down so other pages (Add, List) can use it
    };

    return (
        <adminDataContext.Provider value={value}>
            {props.children}
        </adminDataContext.Provider>
    );
};

export default AdminContextProvider;