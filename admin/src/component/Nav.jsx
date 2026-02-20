import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from "../assets/logo.png"
import axios from 'axios'
import { adminDataContext } from '../context/AdminContext'
import { toast } from 'react-toastify'

function Nav() {
    let navigate = useNavigate()
    // We get setAdminData to manually clear the user state on logout
    let { getAdmin, setAdminData } = useContext(adminDataContext)

    const logOut = async () => {
        try {
            // FIX: Use relative path. Removed 'serverUrl' to avoid CORS/Domain issues.
            const result = await axios.get("/api/auth/logout", { withCredentials: true })
            
            console.log("Logout response:", result.data)
            
            // 1. Clear the local state so the app knows we are logged out
            setAdminData(null)
            
            // 2. Show success message
            toast.success("Logged Out Successfully")
            
            // 3. Redirect to login page
            navigate("/login")

        } catch (error) {
            console.error("Logout error details:", error.response?.data || error.message)
            
            // Even if the server fails, we clear the local state to "force" logout the UI
            setAdminData(null)
            navigate("/login")
            toast.warn("Session cleared locally")
        }
    }

  return (
    <div className='w-full h-[70px] bg-[#dcdbdbf8] z-10 fixed top-0 flex items-center justify-between px-[30px] overflow-x-hidden shadow-md shadow-black'>
        <div className='w-[30%] flex items-center justify-start gap-[10px] cursor-pointer' onClick={() => navigate("/")}>
            <img src={logo} alt="Logo" className='w-[30px]'/>
            <h1 className='text-[25px] text-[black] font-sans'>OneCart</h1>
        </div>
        <button 
            className='text-[15px] hover:border-[2px] border-[#89daea] cursor-pointer bg-[#000000ca] py-[10px] px-[20px] rounded-2xl text-white' 
            onClick={logOut}
        >
            LogOut
        </button>
    </div>
  )
}

export default Nav