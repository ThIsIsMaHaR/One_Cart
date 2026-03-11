import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const adminDataContext = createContext();

// Cookies allow karne ke liye settings
axios.defaults.withCredentials = true;

const AdminContextProvider = (props) => {
    const [adminData, setAdminData] = useState(null);
    
    // Render Backend URL
    const backendUrl = import.meta.env.VITE_API_URL || "https://onecart-backend-3jhl.onrender.com"; 

    const loginAdmin = async (email, password) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/auth/adminlogin`, { email, password });
            if (data.success) {
                setAdminData(data.adminData); 
                toast.success("Welcome, Admin!");
                return true;
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Login Failed";
            toast.error(errorMsg);
            return false;
        }
    };

    const getAdmin = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/auth/getadmin`);
            if (data.success) setAdminData(data.adminData);
        } catch (error) {
            setAdminData(null);
        }
    };

    useEffect(() => { getAdmin(); }, []);

    // 🚀 FIX: serverUrl aur backendUrl dono export kar rahe hain
    const value = {
        adminData,
        setAdminData,
        loginAdmin,
        getAdmin,
        backendUrl,
        serverUrl: backendUrl 
    };

    return (
        <adminDataContext.Provider value={value}>
            {props.children}
        </adminDataContext.Provider>
    );
};

export default AdminContextProvider;