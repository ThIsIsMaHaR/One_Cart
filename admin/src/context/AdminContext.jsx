import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const adminDataContext = createContext();

axios.defaults.withCredentials = true;

const AdminContextProvider = (props) => {
    const [adminData, setAdminData] = useState(null);
    const [loading, setLoading] = useState(true); // 🚀 NEW: Add loading state

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
            toast.error(error.response?.data?.message || "Login Failed");
            return false;
        }
    };

    const getAdmin = async () => {
        setLoading(true); // Start loading
        try {
            const { data } = await axios.get(`${backendUrl}/api/auth/getadmin`);
            if (data.success) {
                setAdminData(data.adminData);
            } else {
                setAdminData(null);
            }
        } catch (error) {
            setAdminData(null);
        } finally {
            setLoading(false); // Stop loading regardless of success/fail
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
        serverUrl: backendUrl,
        loading // 🚀 Pass loading state to components
    };

    return (
        <adminDataContext.Provider value={value}>
            {props.children}
        </adminDataContext.Provider>
    );
};

export default AdminContextProvider;