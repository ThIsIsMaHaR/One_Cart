import React, { useContext, useState, useEffect } from 'react'
import logo from '../assets/logo.png'
import { IoEyeOutline, IoEye } from "react-icons/io5";
import axios from 'axios'
import { adminDataContext } from '../context/AdminContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Login() {
  const [show, setShow] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  // Get shared state and functions from AdminContext
  const { adminData, getAdmin, backendUrl } = useContext(adminDataContext)
  const navigate = useNavigate()

  // Redirect to Dashboard if already logged in
  useEffect(() => {
    if (adminData) {
      navigate("/")
    }
  }, [adminData, navigate])

  const AdminLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Logic check: Ensure we are hitting the backend fixed with CORS
      const result = await axios.post(`${backendUrl}/api/auth/adminlogin`, 
        { email, password }, 
        { withCredentials: true }
      )
      
      if (result.data.success) {
        console.log("Login Success:", result.data)
        toast.success("Admin Login Successful")
        
        // Refresh the admin data in the Context to trigger the useEffect redirect
        if (getAdmin) {
          await getAdmin()
        }
      } else {
        toast.error(result.data.message || "Invalid Credentials")
      }
    } catch (error) {
      console.error("Detailed Login Error:", error.response?.data || error.message)
      const errorMsg = error.response?.data?.message || "Admin Login Failed"
      toast.error(errorMsg);
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='w-[100vw] h-[100vh] bg-gradient-to-l from-[#141414] to-[#0c2025] text-[white] flex flex-col items-center justify-start'>
      {/* Header / Logo Section */}
      <div className='w-[100%] h-[80px] flex items-center justify-start px-[30px] gap-[10px] cursor-pointer' >
        <img className='w-[40px]' src={logo} alt="logo" />
        <h1 className='text-[22px] font-sans '>OneCart Admin</h1>
      </div>

      {/* Hero Section */}
      <div className='w-[100%] h-[100px] flex items-center justify-center flex-col gap-[10px]'>
        <span className='text-[25px] font-semibold'>Login Page</span>
        <span className='text-[16px]'>Welcome back, please enter your admin credentials</span>
      </div>

      {/* Login Card */}
      <div className='max-w-[600px] w-[90%] h-[400px] bg-[#00000025] border-[1px] border-[#96969635] backdrop-blur-2xl rounded-lg shadow-lg flex items-center justify-center '>
        <form onSubmit={AdminLogin} className='w-[90%] h-[90%] flex flex-col items-center justify-start gap-[20px]'>
          <div className='w-[90%] h-[400px] flex flex-col items-center justify-center gap-[15px] relative'>
            
            {/* Email Input */}
            <input 
              type="email" 
              className='w-[100%] h-[50px] border-[2px] border-[#96969635] rounded-lg shadow-lg bg-transparent placeholder-[#ffffffc7] px-[20px] font-semibold focus:outline-none focus:border-[#6060f5]' 
              placeholder='Admin Email' 
              required  
              onChange={(e) => setEmail(e.target.value)} 
              value={email}
            />
            
            {/* Password Input with Toggle */}
            <div className='w-full relative'>
              <input 
                type={show ? "text" : "password"} 
                className='w-[100%] h-[50px] border-[2px] border-[#96969635] rounded-lg shadow-lg bg-transparent placeholder-[#ffffffc7] px-[20px] font-semibold focus:outline-none focus:border-[#6060f5]' 
                placeholder='Password' 
                required 
                onChange={(e) => setPassword(e.target.value)} 
                value={password}
              />
              <div 
                className='absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-white transition-colors'
                onClick={() => setShow(prev => !prev)}
              >
                {show ? <IoEye size={20} /> : <IoEyeOutline size={20} />}
              </div>
            </div>

            {/* Login Button */}
            <button 
              type="submit"
              disabled={loading}
              className='w-[100%] h-[50px] bg-[#6060f5] hover:bg-[#4e4ef0] transition-all rounded-lg flex items-center justify-center mt-[20px] text-[17px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-md'
            >
              {loading ? "Verifying..." : "Login to Dashboard"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login