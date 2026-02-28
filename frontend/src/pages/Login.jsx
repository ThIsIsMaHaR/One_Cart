import React, { useState, useContext } from 'react'
import Logo from "../assets/logo.png"
import { useNavigate } from 'react-router-dom'
import { IoEyeOutline, IoEye } from "react-icons/io5";
import { authDataContext } from '../context/AuthContext';
import { userDataContext } from '../context/UserContext';
import axios from 'axios';
import Loading from '../component/Loading';
import { toast } from 'react-toastify';

function Login() {
    const [show, setShow] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const { serverUrl } = useContext(authDataContext)
    const { getCurrentUser } = useContext(userDataContext)
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        
        try {
            // hitting the backend with correct credentials
            const response = await axios.post(`${serverUrl}/api/auth/login`, {
                email: email.trim().toLowerCase(), // Normalize email
                password
            }, { 
                withCredentials: true, // REQUIRED for cookies to work
                headers: { 'Content-Type': 'application/json' }
            })

            if (response.data.success) {
                // 1. Fetch user data immediately after successful cookie placement
                await getCurrentUser() 
                
                toast.success(response.data.message || "Welcome to OneCart!")
                
                // 2. Clear fields and navigate
                setEmail("")
                setPassword("")
                navigate("/")
            }
        } catch (error) {
            console.error("Full Login Error:", error.response || error)
            
            // 3. Detailed Error Feedback
            if (!error.response) {
                // Occurs if the server is sleeping (Render free tier) or down
                toast.error("Server is not responding. Please wait a moment and try again.")
            } else {
                // Displays the specific error from your AuthController (e.g., "Incorrect password")
                const errorMsg = error.response.data.message || "Login failed. Please try again."
                toast.error(errorMsg)
            }
        } finally {
            // Ensures loading stops regardless of success or failure
            setLoading(false)
        }
    }

    return (
        <div className='w-[100vw] h-[100vh] bg-gradient-to-l from-[#141414] to-[#0c2025] text-[white] flex flex-col items-center justify-start'>
            {/* Header / Logo */}
            <div className='w-[100%] h-[80px] flex items-center justify-start px-[30px] gap-[10px] cursor-pointer' onClick={() => navigate("/")}>
                <img className='w-[40px]' src={Logo} alt="OneCart Logo" />
                <h1 className='text-[22px] font-sans '>OneCart</h1>
            </div>

            {/* Title Section */}
            <div className='w-[100%] h-[100px] flex items-center justify-center flex-col gap-[10px]'>
                <span className='text-[25px] font-semibold'>Login Page</span>
                <span className='text-[16px] text-gray-400'>Welcome back! Please enter your details.</span>
            </div>

            {/* Login Card */}
            <div className='max-w-[600px] w-[90%] h-[420px] bg-[#00000025] border-[1px] border-[#96969635] backdrop-blur-2xl rounded-lg shadow-lg flex items-center justify-center '>
                <form onSubmit={handleLogin} className='w-[90%] h-[90%] flex flex-col items-center justify-start gap-[20px]'>
                    <div className='w-[90%] flex flex-col items-center justify-center gap-[15px] relative mt-10'>
                        
                        {/* Email Input */}
                        <input 
                            type="email" 
                            className='w-[100%] h-[50px] border-[2px] border-[#96969635] bg-transparent rounded-lg px-[20px] placeholder-[#ffffffc7] font-semibold outline-none focus:border-[#6060f5] transition-all' 
                            placeholder='Email' 
                            required 
                            onChange={(e) => setEmail(e.target.value)} 
                            value={email} 
                        />
                        
                        {/* Password Input Group */}
                        <div className="w-full relative">
                            <input 
                                type={show ? "text" : "password"} 
                                className='w-[100%] h-[50px] border-[2px] border-[#96969635] bg-transparent rounded-lg px-[20px] placeholder-[#ffffffc7] font-semibold outline-none focus:border-[#6060f5] transition-all' 
                                placeholder='Password' 
                                required 
                                onChange={(e) => setPassword(e.target.value)} 
                                value={password} 
                            />
                            <div 
                                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-xl text-[#969696] hover:text-white"
                                onClick={() => setShow(!show)}
                            >
                                {show ? <IoEye /> : <IoEyeOutline />}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button 
                            type="submit"
                            disabled={loading}
                            className='w-[100%] h-[50px] bg-[#6060f5] hover:bg-[#4e4ef0] disabled:bg-gray-600 transition-colors rounded-lg mt-[10px] text-[17px] font-semibold flex items-center justify-center'
                        >
                            {loading ? <Loading /> : "Login"}
                        </button>
                        
                        {/* Toggle to Signup */}
                        <p className='flex gap-[10px] mt-2 text-sm'>
                            Don't have an account? 
                            <span 
                                className='text-[#5555f6cf] font-bold cursor-pointer hover:underline' 
                                onClick={() => navigate("/signup")}
                            >
                                Create New Account
                            </span>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login