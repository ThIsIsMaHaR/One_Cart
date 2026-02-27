import React, { useContext, useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import axios from 'axios'
import Registration from './pages/Registration'
import Home from './pages/Home'
import Login from './pages/Login'
import Nav from './component/Nav'
import { userDataContext } from './context/UserContext'
import About from './pages/About'
import Collections from './pages/Collections'
import Product from './pages/Product'
import Contact from './pages/Contact'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import PlaceOrder from './pages/PlaceOrder'
import Order from './pages/Order'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import NotFound from './pages/NotFound'
import Ai from './component/Ai'

// 1. GLOBAL AXIOS CONFIGURATION
// This ensures that cookies (JWT) are sent with every request to the backend
axios.defaults.withCredentials = true;

function App() {
    const { userData, loading } = useContext(userDataContext)
    const location = useLocation()

    // 2. LOADING STATE
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="text-gray-500 font-medium">Loading your profile...</p>
                </div>
            </div>
        )
    }
  
    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />
            {/* Show Nav only if user is logged in */}
            {userData && <Nav/>}
            
            <div className={userData ? "container mx-auto px-4" : ""}>
                <Routes>
                    {/* Public Routes */}
                    <Route path='/login' 
                        element={userData ? <Navigate to={location.state?.from || "/"}/> : <Login/>}
                    />

                    <Route path='/signup' 
                        element={userData ? <Navigate to={location.state?.from || "/"}/> : <Registration/>}
                    />

                    {/* Protected Routes - Redirect to Login if no userData */}
                    <Route path='/' element={userData ? <Home/> : <Navigate to="/login" state={{from: location.pathname}} /> }/>
                    <Route path='/about' element={userData ? <About/> : <Navigate to="/login" state={{from: location.pathname}} /> }/>
                    <Route path='/collection' element={userData ? <Collections/> : <Navigate to="/login" state={{from: location.pathname}} /> }/>
                    <Route path='/product' element={userData ? <Product/> : <Navigate to="/login" state={{from: location.pathname}} /> }/>
                    <Route path='/contact' element={userData ? <Contact/> : <Navigate to="/login" state={{from: location.pathname}} /> }/>
                    <Route path='/productdetail/:productId' element={userData ? <ProductDetail/> : <Navigate to="/login" state={{from: location.pathname}} /> }/>
                    <Route path='/cart' element={userData ? <Cart/> : <Navigate to="/login" state={{from: location.pathname}} /> }/>
                    <Route path='/placeorder' element={userData ? <PlaceOrder/> : <Navigate to="/login" state={{from: location.pathname}} /> }/>
                    <Route path='/order' element={userData ? <Order/> : <Navigate to="/login" state={{from: location.pathname}} /> }/>

                    {/* Fallback Route */}
                    <Route path='*' element={<NotFound/>}/>
                </Routes>
            </div>
            <Ai/>
        </>
    )
}

export default App