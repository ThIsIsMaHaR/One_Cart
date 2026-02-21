import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const adminDataContext = createContext();

const AdminContextProvider = (props) => {
    const [adminData, setAdminData] = useState(null);
    
    // 🔥 ALWAYS use the absolute URL for Render deployments
    const backendUrl = "https://onecart-62p0.onrender.com";

    const getAdmin = async () => {
        try {
            // Force absolute path to avoid the /admin/api/ 404 error
            const { data } = await axios.get(`${backendUrl}/api/user/getadmin`, { withCredentials: true });
            if (data.success) {
                setAdminData(data.admin);
            }
        } catch (error) {
            console.log("Admin Fetch Error:", error.response?.status || error.message);
            setAdminData(null);
        }
    };

    useEffect(() => {
        getAdmin();
    }, []);

    const value = {
        adminData, setAdminData, getAdmin, backendUrl
    };

    return (
        <adminDataContext.Provider value={value}>
            {props.children}
        </adminDataContext.Provider>
    );
};

export default AdminContextProvider;