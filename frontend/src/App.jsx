import React, { useContext } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
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
import { ToastContainer } from 'react-toastify';
import NotFound from './pages/NotFound'
import Ai from './component/Ai'

function App() {
    const { userData, loading } = useContext(userDataContext)
    const location = useLocation()

    // STOP the redirect loop while fetching user data
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }
  
    return (
        <>
            <ToastContainer />
            {userData && <Nav/>}
            <Routes>
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

                <Route path='*' element={<NotFound/>}/>
            </Routes>
            <Ai/>
        </>
    )
}

export default App