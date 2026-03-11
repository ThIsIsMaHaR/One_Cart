import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// 1. Context ka naam hamesha yahi rakhein
export const adminDataContext = createContext();

axios.defaults.withCredentials = true;

const AdminContextProvider = (props) => {
    const [adminData, setAdminData] = useState(null);
    const backendUrl = import.meta.env.VITE_API_URL || "https://onecart-backend-3jhl.onrender.com"; 

    const loginAdmin = async (email, password) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/auth/adminlogin`, { email, password });
            if (data.success) {
                setAdminData(data.adminData); 
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
        serverUrl: backendUrl // 👈 Yeh sabse important hai, isi ki wajah se blank screen aa rahi thi
    };

    return (
        <adminDataContext.Provider value={value}>
            {props.children}
        </adminDataContext.Provider>
    );
};

export default AdminContextProvider;