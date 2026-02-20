import React, { createContext, useContext, useEffect, useState } from 'react'
import { authDataContext } from './AuthContext'
import axios from 'axios'

export const adminDataContext = createContext()

function AdminContext({children}) {
    let [adminData, setAdminData] = useState(null)
    
    // We still get serverUrl from AuthContext, 
    // but we can also define it here specifically for Admin if needed.
    let { serverUrl } = useContext(authDataContext)

    // PRO TIP: Use this line to ensure you're always hitting the right URL
    const finalUrl = import.meta.env.VITE_BACKEND_URL || serverUrl || "http://localhost:8000";

    const getAdmin = async () => {
      try {
          // Changed 'serverUrl' to 'finalUrl'
          let result = await axios.get(finalUrl + "/api/user/getadmin", { withCredentials: true })

          setAdminData(result.data)
          console.log("Admin Data Loaded:", result.data)
      } catch (error) {
          setAdminData(null)
          console.log("Admin Fetch Error:", error)
      }
    }

    useEffect(() => {
      getAdmin()
    }, [])

    let value = {
        adminData, setAdminData, getAdmin
    }

    return (
        <adminDataContext.Provider value={value}>
            {children}
        </adminDataContext.Provider>
    )
}

export default AdminContext