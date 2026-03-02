import React, { useContext } from 'react'
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

// GLOBAL AXIOS CONFIGURATION
axios.defaults.withCredentials = true;

function App() {
    const { userData, loading } = useContext(userDataContext)
    const location = useLocation()

    // LOADING STATE
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="text-gray-400 font-medium">Loading OneCart...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen w-full flex flex-col overflow-x-hidden bg-white text-black">
            <ToastContainer position="top-right" autoClose={3000} />
            
            {/* Nav remains full width */}
            {userData && <Nav/>}
            
            {/* MAIN WRAPPER: 
               We removed 'container mx-auto' and 'px-4' from here.
               Now, individual pages like 'Collections' can use the full width,
               preventing that "compact" look you hated.
            */}
            <main className="flex-grow w-full">
                <Routes>
                    {/* Public Routes */}
                    <Route path='/login' 
                        element={userData ? <Navigate to={location.state?.from || "/"}/> : <Login/>}
                    />

                    <Route path='/signup' 
                        element={userData ? <Navigate to={location.state?.from || "/"}/> : <Registration/>}
                    />

                    {/* Protected Routes */}
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
            </main>
            
            <Ai/>
        </div>
    )
}

export default App