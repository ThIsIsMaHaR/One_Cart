import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// 1. ISSE DHAYAN SE DEKHO: Named export for the context
export const adminDataContext = createContext();

axios.defaults.withCredentials = true;

const AdminContextProvider = ({ children }) => {
    const [adminData, setAdminData] = useState(null);
    const backendUrl = import.meta.env.VITE_API_URL || "https://onecart-backend-3jhl.onrender.com"; 

    const loginAdmin = async (email, password) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/auth/adminlogin`, { email, password });
            if (data.success) {
                setAdminData(data.adminData); 
                toast.success("Login Successful");
                return true;
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Login Failed");
            return false;
        }
    };

    const value = {
        adminData, 
        setAdminData, 
        loginAdmin,
        backendUrl,
        serverUrl: backendUrl 
    };

    return (
        <adminDataContext.Provider value={value}>
            {children}
        </adminDataContext.Provider>
    );
};

// 2. Default export for the Provider
export default AdminContextProvider;