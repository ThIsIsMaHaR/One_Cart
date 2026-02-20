import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { authDataContext } from './AuthContext'
import axios from 'axios'

export const adminDataContext = createContext()

function AdminContext({children}) {
    const [adminData, setAdminData] = useState(null)
    const { serverUrl } = useContext(authDataContext)

    // 1. Wrap in useCallback to prevent the function from being "re-created" 
    // every time the component renders. This stops loops.
    const getAdmin = useCallback(async () => {
      try {
          const result = await axios.get("/api/user/getadmin", { withCredentials: true })

          if (result.data) {
              // 2. Only update state if the data is actually different
              setAdminData(prev => {
                if (JSON.stringify(prev) === JSON.stringify(result.data)) return prev;
                return result.data;
              })
              console.log("Admin Data Loaded:", result.data)
          }
      } catch (error) {
          setAdminData(null)
          console.log("Admin Fetch Error (Not logged in):", error.response?.status)
      }
    }, []) 

    useEffect(() => {
      // Only fetch if we don't already have the data
      if (!adminData) {
        getAdmin()
      }
    }, [getAdmin, adminData])

    const value = {
        adminData, setAdminData, getAdmin
    }

    return (
        <adminDataContext.Provider value={value}>
            {children}
        </adminDataContext.Provider>
    )
}

export default AdminContext