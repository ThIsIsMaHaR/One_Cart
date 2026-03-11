import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const adminDataContext = createContext();

// Axios default settings
axios.defaults.withCredentials = true;

const AdminContextProvider = (props) => {
    const [adminData, setAdminData] = useState(null);
    
    // Environment Variable for backend
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
            console.error("Login detail:", error);
            const errorMsg = error.response?.data?.message || "Login Failed";
            toast.error(errorMsg);
            return false;
        }
    };

    const getAdmin = async () => {
        if (!backendUrl) return;
        try {
            const { data } = await axios.get(`${backendUrl}/api/auth/getadmin`);
            if (data.success) {
                setAdminData(data.adminData);
            } else {
                setAdminData(null);
            }
        } catch (error) {
            setAdminData(null);
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
        backendUrl,
        serverUrl: backendUrl // 👈 Yahan fix hai! Dono names export kar diye
    };

    return (
        <adminDataContext.Provider value={value}>
            {props.children}
        </adminDataContext.Provider>
    );
};

export default AdminContextProvider;