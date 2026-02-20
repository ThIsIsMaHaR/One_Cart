import React, { createContext, useContext, useEffect, useState } from 'react'
import { authDataContext } from './AuthContext'
import axios from 'axios'

export const adminDataContext = createContext()

function AdminContext({children}) {
    let [adminData, setAdminData] = useState(null)
    
    // We keep serverUrl for compatibility, but for Render, 
    // we use relative paths (starting with /api)
    let { serverUrl } = useContext(authDataContext)

    const getAdmin = async () => {
      try {
          // FIX: Removed finalUrl. Using a relative path works best on Render.
          // ALSO: Ensure this path (/api/user/getadmin) matches your backend route!
          let result = await axios.get("/api/user/getadmin", { withCredentials: true })

          // Check if result.data exists and contains the admin info
          if (result.data) {
              setAdminData(result.data)
              console.log("Admin Data Loaded:", result.data)
          }
      } catch (error) {
          setAdminData(null)
          console.log("Admin Fetch Error (Not logged in):", error.response?.status)
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