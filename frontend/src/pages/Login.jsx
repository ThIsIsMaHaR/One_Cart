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
    let [show, setShow] = useState(false)
    let [email, setEmail] = useState("")
    let [password, setPassword] = useState("")
    let { serverUrl } = useContext(authDataContext)
    let { getCurrentUser } = useContext(userDataContext)
    let [loading, setLoading] = useState(false)

    let navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        
        try {
            // hitting the backend with correct credentials
            const result = await axios.post(`${serverUrl}/api/auth/login`, {
                email: email.trim(), // Trim to prevent accidental spaces
                password
            }, { 
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            })

            if (result.data.success) {
                console.log("Login Success:", result.data)
                
                // 1. Update the user state
                await getCurrentUser() 
                
                // 2. Clear fields
                setEmail("")
                setPassword("")
                
                setLoading(false)
                toast.success("User Login Successful")
                navigate("/")
            }

        } catch (error) {
            setLoading(false)
            console.error("Login Error:", error)
            
            // Handle the specific CORS vs Auth error
            const errorMsg = error.response?.data?.message || "Invalid Email or Password"
            toast.error(errorMsg)
        }
    }

    return (
        <div className='w-[100vw] h-[100vh] bg-gradient-to-l from-[#141414] to-[#0c2025] text-[white] flex flex-col items-center justify-start'>
            <div className='w-[100%] h-[80px] flex items-center justify-start px-[30px] gap-[10px] cursor-pointer' onClick={() => navigate("/")}>
                <img className='w-[40px]' src={Logo} alt="OneCart Logo" />
                <h1 className='text-[22px] font-sans '>OneCart</h1>
            </div>

            <div className='w-[100%] h-[100px] flex items-center justify-center flex-col gap-[10px]'>
                <span className='text-[25px] font-semibold'>Login Page</span>
                <span className='text-[16px]'>Welcome to OneCart, Place your order</span>
            </div>

            <div className='max-w-[600px] w-[90%] h-[400px] bg-[#00000025] border-[1px] border-[#96969635] backdrop-blur-2xl rounded-lg shadow-lg flex items-center justify-center '>
                <form onSubmit={handleLogin} className='w-[90%] h-[90%] flex flex-col items-center justify-start gap-[20px]'>
                    <div className='w-[90%] flex flex-col items-center justify-center gap-[15px] relative mt-10'>
                        <input 
                            type="email" 
                            className='w-[100%] h-[50px] border-[2px] border-[#96969635] bg-transparent rounded-lg px-[20px] placeholder-[#ffffffc7] font-semibold outline-none focus:border-[#6060f5]' 
                            placeholder='Email' 
                            required 
                            onChange={(e) => setEmail(e.target.value)} 
                            value={email} 
                        />
                        
                        <div className="w-full relative">
                            <input 
                                type={show ? "text" : "password"} 
                                className='w-[100%] h-[50px] border-[2px] border-[#96969635] bg-transparent rounded-lg px-[20px] placeholder-[#ffffffc7] font-semibold outline-none focus:border-[#6060f5]' 
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

                        <button 
                            type="submit"
                            disabled={loading}
                            className='w-[100%] h-[50px] bg-[#6060f5] hover:bg-[#4e4ef0] transition-colors rounded-lg mt-[10px] text-[17px] font-semibold flex items-center justify-center'
                        >
                            {loading ? <Loading /> : "Login"}
                        </button>
                        
                        <p className='flex gap-[10px] mt-2 text-sm'>
                            Don't have an account? 
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