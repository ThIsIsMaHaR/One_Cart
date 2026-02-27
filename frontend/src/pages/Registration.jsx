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
    let [show, setShow] = useState(false)
    let { serverUrl } = useContext(authDataContext)
    let [name, setName] = useState("")
    let [email, setEmail] = useState("")
    let [password, setPassword] = useState("")
    let { getCurrentUser } = useContext(userDataContext)
    let [loading, setLoading] = useState(false)

    let navigate = useNavigate()

    const handleSignup = async (e) => {
        e.preventDefault()
        setLoading(true)
        
        try {
            // Ensure URL doesn't have double slashes
            const baseUrl = serverUrl.endsWith('/') ? serverUrl.slice(0, -1) : serverUrl;

            const response = await axios.post(`${baseUrl}/api/auth/registration`, 
                { name, email, password }, 
                { 
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )

            if (response.data.success) {
                toast.success("User Registration Successful")
                // Adding a tiny delay to allow the cookie to be set by the browser
                setTimeout(async () => {
                    await getCurrentUser()
                    navigate("/")
                }, 500);
            }
        } catch (error) {
            console.error("Signup Error Details:", error.response?.data || error.message);
            const errorMsg = error.response?.data?.message || "User Registration Failed";
            toast.error(errorMsg);
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='w-[100vw] h-[100vh] bg-gradient-to-l from-[#141414] to-[#0c2025] text-[white] flex flex-col items-center justify-start'>
            <div className='w-[100%] h-[80px] flex items-center justify-start px-[30px] gap-[10px] cursor-pointer' onClick={() => navigate("/")}>
                <img className='w-[40px]' src={Logo} alt="OneCart" />
                <h1 className='text-[22px] font-sans '>OneCart</h1>
            </div>

            <div className='w-[100%] h-[100px] flex items-center justify-center flex-col gap-[10px]'>
                <span className='text-[25px] font-semibold'>Registration Page</span>
                <span className='text-[16px]'>Welcome to OneCart, Place your order</span>
            </div>

            <div className='max-w-[600px] w-[90%] h-[500px] bg-[#00000025] border-[1px] border-[#96969635] backdrop-blur-2xl rounded-lg shadow-lg flex items-center justify-center '>
                <form onSubmit={handleSignup} className='w-[90%] h-[90%] flex flex-col items-center justify-start gap-[20px]'>
                    <div className='w-[90%] flex flex-col items-center justify-center gap-[15px] relative mt-10'>
                        <input type="text" className='w-[100%] h-[50px] border-[2px] border-[#96969635] bg-transparent rounded-lg px-[20px] outline-none focus:border-[#6060f5]' placeholder='UserName' required onChange={(e) => setName(e.target.value)} value={name} />
                        <input type="email" className='w-[100%] h-[50px] border-[2px] border-[#96969635] bg-transparent rounded-lg px-[20px] outline-none focus:border-[#6060f5]' placeholder='Email' required onChange={(e) => setEmail(e.target.value)} value={email} />
                        
                        <div className="w-full relative">
                            <input type={show ? "text" : "password"} className='w-[100%] h-[50px] border-[2px] border-[#96969635] bg-transparent rounded-lg px-[20px] outline-none focus:border-[#6060f5]' placeholder='Password' required onChange={(e) => setPassword(e.target.value)} value={password} />
                            <div className='absolute right-4 top-4 cursor-pointer text-xl' onClick={() => setShow(!show)}>
                                {show ? <IoEye /> : <IoEyeOutline />}
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className='w-[100%] h-[50px] bg-[#6060f5] hover:bg-[#4e4ef0] rounded-lg mt-[20px] font-semibold flex items-center justify-center transition-all'>
                            {loading ? <Loading /> : "Create Account"}
                        </button>
                        <p className='flex gap-[10px]'>Already have an account? <span className='text-[#5555f6cf] cursor-pointer hover:underline' onClick={() => navigate("/login")}>Login</span></p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Registration