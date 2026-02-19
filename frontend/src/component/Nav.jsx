import React, { useContext, useState } from 'react'
import logo from '../assets/logo.png'
import { IoSearchCircleOutline, IoSearchCircleSharp } from "react-icons/io5";
import { FaCircleUser } from "react-icons/fa6";
import { MdOutlineShoppingCart, MdContacts } from "react-icons/md";
import { IoMdHome } from "react-icons/io";
import { HiOutlineCollection } from "react-icons/hi";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Context Imports
import { userDataContext } from '../context/UserContext';
import { authDataContext } from '../context/AuthContext';
import { shopDataContext } from '../context/ShopContext';

function Nav() {
    let { getCurrentUser, userData } = useContext(userDataContext)
    let { serverUrl } = useContext(authDataContext)
    let { showSearch, setShowSearch, search, setSearch, getCartCount } = useContext(shopDataContext)
    let [showProfile, setShowProfile] = useState(false)
    let navigate = useNavigate()

    const handleLogout = async () => {
        try {
            // 1. Call backend to clear cookies/session
            await axios.get(serverUrl + "/api/auth/logout", { withCredentials: true })
            
            // 2. Clear all local browser storage
            localStorage.clear();
            sessionStorage.clear();

            // 3. HARD REFRESH to the login page
            // This restarts the React app, clearing all "stuck" state variables.
            window.location.href = "/login";

        } catch (error) {
            console.error("Logout Error:", error)
            // Force a redirect even if the server call fails
            localStorage.clear();
            window.location.href = "/login";
        }
    }

    return (
        <div className='w-[100vw] h-[70px] bg-[#ecfafaec] z-10 fixed top-0 flex items-center justify-between px-[30px] shadow-md shadow-black '>

            {/* Logo Section */}
            <div className='w-[20%] lg:w-[30%] flex items-center justify-start gap-[10px] '>
                <img src={logo} alt="Logo" className='w-[30px]' />
                <h1 className='text-[25px] text-[black] font-sans '>OneCart</h1>
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
                {!userData ? (
                    <FaCircleUser className='w-[29px] h-[29px] text-[#000000] cursor-pointer' onClick={() => setShowProfile(prev => !prev)} />
                ) : (
                    <div className='w-[30px] h-[30px] bg-[#080808] text-[white] rounded-full flex items-center justify-center cursor-pointer font-bold' onClick={() => setShowProfile(prev => !prev)}>
                        {userData?.name?.slice(0, 1).toUpperCase()}
                    </div>
                )}

                <div className='relative'>
                    <MdOutlineShoppingCart className='w-[30px] h-[30px] text-[#000000] cursor-pointer hidden md:block' onClick={() => navigate("/cart")} />
                    <p className='absolute w-[18px] h-[18px] flex items-center justify-center bg-black text-white rounded-full text-[9px] top-[-5px] right-[-5px] hidden md:flex'>{getCartCount()}</p>
                </div>
            </div>

            {/* Search Input Bar */}
            {showSearch && (
                <div className='w-[100%] h-[80px] bg-[#d8f6f9dd] absolute top-[100%] left-0 right-0 flex items-center justify-center '>
                    <input type="text" className='lg:w-[50%] w-[80%] h-[60%] bg-[#233533] rounded-[30px] px-[50px] placeholder:text-white text-[white] text-[18px]' placeholder='Search Here' onChange={(e) => { setSearch(e.target.value) }} value={search} />
                </div>
            )}

            {/* Profile Menu Dropdown */}
            {showProfile && (
                <div className='absolute w-[220px] bg-[#000000d7] top-[110%] right-[4%] border-[1px] border-[#aaa9a9] rounded-[10px] z-10 overflow-hidden'>
                    <ul className='w-[100%] flex flex-col text-[17px] text-[white]'>
                        {!userData ? (
                            <li className='w-[100%] hover:bg-[#2f2f2f] px-[15px] py-[12px] cursor-pointer' onClick={() => { navigate("/login"); setShowProfile(false) }}>Login</li>
                        ) : (
                            <li className='w-[100%] hover:bg-[#2f2f2f] px-[15px] py-[12px] cursor-pointer border-b border-[#444]' onClick={handleLogout}>LogOut</li>
                        )}
                        <li className='w-[100%] hover:bg-[#2f2f2f] px-[15px] py-[12px] cursor-pointer' onClick={() => { navigate("/order"); setShowProfile(false) }}>Orders</li>
                        <li className='w-[100%] hover:bg-[#2f2f2f] px-[15px] py-[12px] cursor-pointer' onClick={() => { navigate("/about"); setShowProfile(false) }}>About</li>
                    </ul>
                </div>
            )}

            {/* Mobile Bottom Navigation */}
            <div className='w-[100vw] h-[80px] flex items-center justify-between px-[20px] text-[12px] fixed bottom-0 left-0 bg-[#191818] md:hidden'>
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