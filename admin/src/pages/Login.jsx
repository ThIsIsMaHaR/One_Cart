import React, { useContext, useState, useEffect } from 'react'
import logo from '../assets/logo.png'
import { IoEyeOutline } from "react-icons/io5";
import { IoEye } from "react-icons/io5";
import axios from 'axios'
import { authDataContext } from '../context/AuthContext';
import { adminDataContext } from '../context/AdminContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Login() {
  let [show, setShow] = useState(false)
  let [email, setEmail] = useState("")
  let [password, setPassword] = useState("")
  
  let { serverUrl } = useContext(authDataContext)
  let { adminData, getAdmin } = useContext(adminDataContext)
  let navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  // 1. AUTOMATIC REDIRECT: If adminData becomes available, move to dashboard
  useEffect(() => {
    if (adminData) {
      navigate("/")
    }
  }, [adminData, navigate])

  const AdminLogin = async (e) => {
    setLoading(true)
    e.preventDefault()
    try {
      // Use relative path for Render deployment
      const result = await axios.post('/api/auth/adminlogin', { email, password }, { withCredentials: true })
      
      if (result.data) {
        console.log("Login Success:", result.data)
        toast.success("Admin Login Successful")
        
        // 2. REFRESH DATA: Fetch the admin profile into Context
        if (getAdmin) {
          await getAdmin()
        }
        // Note: The useEffect above will handle the navigate("/") once data is loaded
      }
    } catch (error) {
      console.error("Detailed Login Error:", error.response?.data || error.message)
      const errorMsg = error.response?.data?.message || "Admin Login Failed"
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='w-[100vw] h-[100vh] bg-gradient-to-l from-[#141414] to-[#0c2025] text-[white] flex flex-col items-center justify-start'>
      <div className='w-[100%] h-[80px] flex items-center justify-start px-[30px] gap-[10px] cursor-pointer' >
        <img className='w-[40px]' src={logo} alt="logo" />
        <h1 className='text-[22px] font-sans '>OneCart</h1>
      </div>

      <div className='w-[100%] h-[100px] flex items-center justify-center flex-col gap-[10px]'>
        <span className='text-[25px] font-semibold'>Login Page</span>
        <span className='text-[16px]'>Welcome to OneCart, Apply to Admin Login</span>
      </div>

      <div className='max-w-[600px] w-[90%] h-[400px] bg-[#00000025] border-[1px] border-[#96969635] backdrop-blur-2xl rounded-lg shadow-lg flex items-center justify-center '>
        <form onSubmit={AdminLogin} className='w-[90%] h-[90%] flex flex-col items-center justify-start gap-[20px]'>
          <div className='w-[90%] h-[400px] flex flex-col items-center justify-center gap-[15px] relative'>
            <input 
              type="email" 
              className='w-[100%] h-[50px] border-[2px] border-[#96969635] rounded-lg shadow-lg bg-transparent placeholder-[#ffffffc7] px-[20px] font-semibold' 
              placeholder='Email' 
              required  
              onChange={(e) => setEmail(e.target.value)} 
              value={email}
            />
            
            <div className='w-full relative'>
              <input 
                type={show ? "text" : "password"} 
                className='w-[100%] h-[50px] border-[2px] border-[#96969635] rounded-lg shadow-lg bg-transparent placeholder-[#ffffffc7] px-[20px] font-semibold' 
                placeholder='Password' 
                required 
                onChange={(e) => setPassword(e.target.value)} 
                value={password}
              />
              <div 
                className='absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400'
                onClick={() => setShow(prev => !prev)}
              >
                {show ? <IoEye size={20} /> : <IoEyeOutline size={20} />}
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className='w-[100%] h-[50px] bg-[#6060f5] hover:bg-[#4e4ef0] transition-colors rounded-lg flex items-center justify-center mt-[20px] text-[17px] font-semibold disabled:opacity-50'
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login