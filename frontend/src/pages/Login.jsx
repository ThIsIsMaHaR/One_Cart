import React, { useState, useContext } from 'react'
import Logo from "../assets/logo.png"
import { useNavigate } from 'react-router-dom'
import { IoEyeOutline, IoEye } from "react-icons/io5";
import { authDataContext } from '../context/AuthContext';
import { userDataContext } from '../context/UserContext';
import axios from 'axios';
import Loading from '../component/Loading';
import { toast } from 'react-toastify'; // Fixed: Using your existing library

function Login() {
    let [show, setShow] = useState(false)
    let [email, setEmail] = useState("")
    let [password, setPassword] = useState("")
    let { serverUrl } = useContext(authDataContext)
    let { getCurrentUser } = useContext(userDataContext)
    let [loading, setLoading] = useState(false)

    let navigate = useNavigate()

    const handleLogin = async (e) => {
        setLoading(true)
        e.preventDefault()
        try {
            // This hits YOUR Node.js server (e.g., localhost:8000)
            let result = await axios.post(serverUrl + '/api/auth/login', {
                email, password
            }, { withCredentials: true })

            console.log("Login Success:", result.data)
            setLoading(false)
            
            // This updates your global user state
            getCurrentUser() 
            
            navigate("/")
            toast.success("User Login Successful")

        } catch (error) {
            setLoading(false)
            console.error("Login Error:", error)
            // If the backend sends a specific message, we show it, otherwise a default
            const errorMsg = error.response?.data?.message || "User Login Failed"
            toast.error(errorMsg)
        }
    }

    return (
        <div className='w-[100vw] h-[100vh] bg-gradient-to-l from-[#141414] to-[#0c2025] text-[white] flex flex-col items-center justify-start'>
            {/* Header / Logo Section */}
            <div className='w-[100%] h-[80px] flex items-center justify-start px-[30px] gap-[10px] cursor-pointer' onClick={() => navigate("/")}>
                <img className='w-[40px]' src={Logo} alt="OneCart Logo" />
                <h1 className='text-[22px] font-sans '>OneCart</h1>
            </div>

            {/* Title Section */}
            <div className='w-[100%] h-[100px] flex items-center justify-center flex-col gap-[10px]'>
                <span className='text-[25px] font-semibold'>Login Page</span>
                <span className='text-[16px]'>Welcome to OneCart, Place your order</span>
            </div>

            {/* Login Form Card */}
            <div className='max-w-[600px] w-[90%] h-[400px] bg-[#00000025] border-[1px] border-[#96969635] backdrop-blur-2xl rounded-lg shadow-lg flex items-center justify-center '>
                <form action="" onSubmit={handleLogin} className='w-[90%] h-[90%] flex flex-col items-center justify-start gap-[20px]'>
                    
                    {/* Input Fields Container */}
                    <div className='w-[90%] flex flex-col items-center justify-center gap-[15px] relative mt-10'>
                        
                        {/* Email Input */}
                        <input 
                            type="email" 
                            className='w-[100%] h-[50px] border-[2px] border-[#96969635] bg-transparent rounded-lg px-[20px] placeholder-[#ffffffc7] font-semibold' 
                            placeholder='Email' 
                            required 
                            onChange={(e) => setEmail(e.target.value)} 
                            value={email} 
                        />
                        
                        {/* Password Input Group */}
                        <div className="w-full relative">
                            <input 
                                type={show ? "text" : "password"} 
                                className='w-[100%] h-[50px] border-[2px] border-[#96969635] bg-transparent rounded-lg px-[20px] placeholder-[#ffffffc7] font-semibold' 
                                placeholder='Password' 
                                required 
                                onChange={(e) => setPassword(e.target.value)} 
                                value={password} 
                            />
                            <div 
                                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-xl text-[#969696]"
                                onClick={() => setShow(!show)}
                            >
                                {show ? <IoEye /> : <IoEyeOutline />}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button 
                            type="submit"
                            disabled={loading}
                            className='w-[100%] h-[50px] bg-[#6060f5] hover:bg-[#4e4ef0] transition-colors rounded-lg mt-[10px] text-[17px] font-semibold flex items-center justify-center'
                        >
                            {loading ? <Loading /> : "Login"}
                        </button>
                        
                        {/* Footer Link */}
                        <p className='flex gap-[10px] mt-2'>
                            You haven't any account? 
                            <span 
                                className='text-[#5555f6cf] font-semibold cursor-pointer hover:underline' 
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