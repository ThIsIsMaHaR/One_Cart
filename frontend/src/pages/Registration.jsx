import React, { useState, useContext } from 'react'
import Logo from "../assets/logo.png"
import { useNavigate } from 'react-router-dom'
import { IoEyeOutline, IoEye } from "react-icons/io5";
import { authDataContext } from '../context/AuthContext';
import { userDataContext } from '../context/UserContext';
import axios from 'axios'
import { toast } from 'react-toastify';
import Loading from '../component/Loading';

function Registration() {
    const [show, setShow] = useState(false)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const { serverUrl } = useContext(authDataContext)
    const { getCurrentUser } = useContext(userDataContext)
    const navigate = useNavigate()

    const handleSignup = async (e) => {
        e.preventDefault()
        setLoading(true)
        
        try {
            // Normalize URL and Data
            const baseUrl = serverUrl.endsWith('/') ? serverUrl.slice(0, -1) : serverUrl;
            const payload = { 
                name: name.trim(), 
                email: email.trim().toLowerCase(), 
                password 
            };

            const response = await axios.post(`${baseUrl}/api/auth/registration`, 
                payload, 
                { 
                    withCredentials: true,
                    headers: { 'Content-Type': 'application/json' }
                }
            )

            if (response.data.success) {
                toast.success("User Registration Successful")
                
                // Fetch the user data (this relies on the cookie sent by the registration response)
                await getCurrentUser()
                
                // Navigate to home
                navigate("/")
            }
        } catch (error) {
            console.error("Signup Error Details:", error.response?.data || error.message);
            
            // Check if server is reachable (important for Render spin-up)
            if (!error.response) {
                toast.error("Server is not responding. Please wait a moment.");
            } else {
                const errorMsg = error.response.data.message || "User Registration Failed";
                toast.error(errorMsg);
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='w-screen h-screen bg-linear-to-l from-[#141414] to-[#0c2025] text-[white] flex flex-col items-center justify-start overflow-x-hidden'>
            {/* Logo Section */}
            <div className='w-full h-20 flex items-center justify-start px-7.5 gap-2.5 cursor-pointer' onClick={() => navigate("/")}>
                <img className='w-10' src={Logo} alt="OneCart" />
                <h1 className='text-[22px] font-sans '>OneCart</h1>
            </div>

            {/* Title Section */}
            <div className='w-full h-2.5 flex items-center justify-center flex-col gap-2.5'>
                <span className='text-[25px] font-semibold'>Registration Page</span>
                <span className='text-[16px] text-gray-400'>Join OneCart and start shopping today</span>
            </div>

            {/* Registration Card */}
            <div className='max-w-150 w-[90%] min-h-130 bg-[#00000025] border border-[#96969635] backdrop-blur-2xl rounded-lg shadow-lg flex items-center justify-center py-8'>
                <form onSubmit={handleSignup} className='w-[90%] flex flex-col items-center justify-start gap-5'>
                    <div className='w-[90%] flex flex-col items-center justify-center gap-3.75'>
                        
                        <input 
                            type="text" 
                            className='w-full h-12.5 border-2 border-[#96969635] bg-transparent rounded-lg px-5 outline-none focus:border-[#6060f5] placeholder-gray-500' 
                            placeholder='Full Name' 
                            required 
                            onChange={(e) => setName(e.target.value)} 
                            value={name} 
                        />
                        
                        <input 
                            type="email" 
                            className='w-full h-12.5 border-2 border-[#96969635] bg-transparent rounded-lg px-5 outline-none focus:border-[#6060f5] placeholder-gray-500' 
                            placeholder='Email Address' 
                            required 
                            onChange={(e) => setEmail(e.target.value)} 
                            value={email} 
                        />
                        
                        <div className="w-full relative">
                            <input 
                                type={show ? "text" : "password"} 
                                className='w-full h-12.5 border-2 border-[#96969635] bg-transparent rounded-lg px-5 outline-none focus:border-[#6060f5] placeholder-gray-500' 
                                placeholder='Password (Min. 8 characters)' 
                                required 
                                onChange={(e) => setPassword(e.target.value)} 
                                value={password} 
                            />
                            <div 
                                className='absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-xl text-gray-400 hover:text-white transition-colors' 
                                onClick={() => setShow(!show)}
                            >
                                {show ? <IoEye /> : <IoEyeOutline />}
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading} 
                            className='w-full h-[50px] bg-[#6060f5] hover:bg-[#4e4ef0] disabled:bg-gray-600 rounded-lg mt-[20px] font-semibold flex items-center justify-center transition-all'
                        >
                            {loading ? <Loading /> : "Create Account"}
                        </button>

                        <p className='flex gap-[10px] text-sm mt-2'>
                            Already have an account? 
                            <span 
                                className='text-[#5555f6cf] font-bold cursor-pointer hover:underline' 
                                onClick={() => navigate("/login")}
                            >
                                Login
                            </span>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Registration