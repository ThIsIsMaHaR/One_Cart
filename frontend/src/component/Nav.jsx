import React, { useContext, useState } from 'react'
import logo from '../assets/logo.png'
import { IoSearchCircleOutline, IoSearchCircleSharp } from "react-icons/io5";
import { FaCircleUser } from "react-icons/fa6";
import { MdOutlineShoppingCart, MdContacts } from "react-icons/md";
import { IoMdHome } from "react-icons/io";
import { HiOutlineCollection } from "react-icons/hi";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

// Context Imports
import { userDataContext } from '../context/UserContext';
import { authDataContext } from '../context/AuthContext';
import { shopDataContext } from '../context/ShopContext';

function Nav() {
    // Added setUserData here
    const { userData, setUserData } = useContext(userDataContext)
    const { serverUrl } = useContext(authDataContext)
    const { showSearch, setShowSearch, search, setSearch, getCartCount } = useContext(shopDataContext)
    const [showProfile, setShowProfile] = useState(false)
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            // 1. Call backend (using POST to match standard auth patterns)
            const response = await axios.post(serverUrl + "/api/auth/logout", {}, { withCredentials: true })
            
            if (response.data.success) {
                // 2. IMPORTANT: Clear the React State
                // This triggers App.jsx to immediately redirect to /login
                setUserData(null);
                
                // 3. Clear local storage
                localStorage.clear();
                
                setShowProfile(false);
                toast.success("Logged out successfully");
                navigate("/login");
            }
        } catch (error) {
            console.error("Logout Error:", error)
            // Fallback: Clear state and redirect even if server fails
            setUserData(null);
            localStorage.clear();
            navigate("/login");
        }
    }

    return (
        <div className='w-[100vw] h-[70px] bg-[#ecfafaec] z-20 fixed top-0 flex items-center justify-between px-[30px] shadow-md shadow-black '>

            {/* Logo Section */}
            <div className='w-[20%] lg:w-[30%] flex items-center justify-start gap-[10px] '>
                <img src={logo} alt="Logo" className='w-[30px] cursor-pointer' onClick={() => navigate("/")} />
                <h1 className='text-[25px] text-[black] font-sans cursor-pointer' onClick={() => navigate("/")}>OneCart</h1>
            </div>

            {/* Desktop Navigation Links */}
            <div className='w-[50%] lg:w-[40%] hidden md:flex'>
                <ul className='flex items-center justify-center gap-[19px] text-[white] '>
                    <li className='text-[15px] hover:bg-slate-500 cursor-pointer bg-[#000000c9] py-[10px] px-[20px] rounded-2xl' onClick={() => navigate("/")}>HOME</li>
                    <li className='text-[15px] hover:bg-slate-500 cursor-pointer bg-[#000000c9] py-[10px] px-[20px] rounded-2xl' onClick={() => navigate("/collection")}>COLLECTIONS</li>
                    <li className='text-[15px] hover:bg-slate-500 cursor-pointer bg-[#000000c9] py-[10px] px-[20px] rounded-2xl' onClick={() => navigate("/about")}>ABOUT</li>
                    <li className='text-[15px] hover:bg-slate-500 cursor-pointer bg-[#000000c9] py-[10px] px-[20px] rounded-2xl' onClick={() => navigate("/contact")}>CONTACT</li>
                </ul>
            </div>

            {/* Right Side Icons */}
            <div className='w-[30%] flex items-center justify-end gap-[20px]'>
                {!showSearch && <IoSearchCircleOutline className='w-[38px] h-[38px] text-[#000000] cursor-pointer' onClick={() => { setShowSearch(prev => !prev); navigate("/collection") }} />}
                {showSearch && <IoSearchCircleSharp className='w-[38px] h-[38px] text-[#000000] cursor-pointer' onClick={() => setShowSearch(prev => !prev)} />}
                
                {/* User Profile Logic */}
                <div className='relative'>
                    {!userData ? (
                        <FaCircleUser className='w-[29px] h-[29px] text-[#000000] cursor-pointer' onClick={() => setShowProfile(prev => !prev)} />
                    ) : (
                        <div className='w-[35px] h-[35px] bg-[#080808] text-[white] rounded-full flex items-center justify-center cursor-pointer font-bold border-2 border-gray-300' onClick={() => setShowProfile(prev => !prev)}>
                            {userData?.name?.slice(0, 1).toUpperCase()}
                        </div>
                    )}

                    {/* Profile Menu Dropdown (Moved inside relative container for better positioning) */}
                    {showProfile && (
                        <div className='absolute w-[200px] bg-[#000000d7] top-[45px] right-0 border-[1px] border-[#aaa9a9] rounded-[10px] z-30 overflow-hidden shadow-xl'>
                            <ul className='w-[100%] flex flex-col text-[16px] text-[white]'>
                                {!userData ? (
                                    <li className='w-[100%] hover:bg-[#2f2f2f] px-[15px] py-[12px] cursor-pointer' onClick={() => { navigate("/login"); setShowProfile(false) }}>Login</li>
                                ) : (
                                    <>
                                        <li className='w-[100%] px-[15px] py-[10px] text-gray-400 text-sm italic border-b border-gray-700'>Hi, {userData.name}</li>
                                        <li className='w-[100%] hover:bg-[#2f2f2f] px-[15px] py-[12px] cursor-pointer' onClick={() => { navigate("/order"); setShowProfile(false) }}>Orders</li>
                                        <li className='w-[100%] hover:bg-[#2f2f2f] px-[15px] py-[12px] cursor-pointer' onClick={() => { navigate("/about"); setShowProfile(false) }}>About</li>
                                        <li className='w-[100%] hover:bg-red-900 px-[15px] py-[12px] cursor-pointer border-t border-[#444]' onClick={handleLogout}>LogOut</li>
                                    </>
                                )}
                            </ul>
                        </div>
                    )}
                </div>

                <div className='relative'>
                    <MdOutlineShoppingCart className='w-[30px] h-[30px] text-[#000000] cursor-pointer hidden md:block' onClick={() => navigate("/cart")} />
                    <p className='absolute w-[18px] h-[18px] flex items-center justify-center bg-black text-white rounded-full text-[9px] top-[-5px] right-[-5px] hidden md:flex'>{getCartCount()}</p>
                </div>
            </div>

            {/* Search Input Bar */}
            {showSearch && (
                <div className='w-[100%] h-[80px] bg-[#d8f6f9dd] absolute top-[70px] left-0 right-0 flex items-center justify-center z-10'>
                    <input 
                        type="text" 
                        autoFocus
                        className='lg:w-[50%] w-[80%] h-[60%] bg-[#233533] rounded-[30px] px-[50px] placeholder:text-gray-400 text-[white] text-[18px]' 
                        placeholder='Search Here' 
                        onChange={(e) => setSearch(e.target.value)} 
                        value={search} 
                    />
                </div>
            )}

            {/* Mobile Bottom Navigation */}
            <div className='w-[100vw] h-[80px] flex items-center justify-between px-[20px] text-[12px] fixed bottom-0 left-0 bg-[#191818] md:hidden z-20'>
                <button className='text-[white] flex items-center justify-center flex-col gap-[2px]' onClick={() => navigate("/")}><IoMdHome className='w-[28px] h-[28px]' /> Home</button>
                <button className='text-[white] flex items-center justify-center flex-col gap-[2px]' onClick={() => navigate("/collection")}><HiOutlineCollection className='w-[28px] h-[28px]' /> Collections</button>
                <button className='text-[white] flex items-center justify-center flex-col gap-[2px]' onClick={() => navigate("/contact")}><MdContacts className='w-[28px] h-[28px]' /> Contact</button>
                <button className='text-[white] flex items-center justify-center flex-col gap-[2px] relative' onClick={() => navigate("/cart")}>
                    <MdOutlineShoppingCart className='w-[28px] h-[28px]' /> Cart
                    <span className='absolute top-[-5px] right-[-5px] bg-white text-black font-bold rounded-full w-[16px] h-[16px] flex items-center justify-center text-[10px]'>{getCartCount()}</span>
                </button>
            </div>
        </div>
    )
}

export default Nav