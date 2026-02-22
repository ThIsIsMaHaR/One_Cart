import React, { useContext, useEffect, useState } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Add from './pages/Add'
import Lists from './pages/Lists'
import Orders from './pages/Orders'
import Login from './pages/Login'
import { adminDataContext } from './context/AdminContext'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { adminData, getAdmin } = useContext(adminDataContext);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        // If we don't have adminData, try to fetch it from the server cookie
        if (!adminData && getAdmin) {
          await getAdmin();
        }
      } catch (error) {
        console.error("Auth check failed", error);
      } finally {
        // Stop the loading spinner
        setCheckingAuth(false);
      }
    };
    verifyAdmin();
  }, []); // Only run once on mount

  if (checkingAuth) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#0c2025] text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6060f5]"></div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* Protected Routing Logic */}
        {!adminData ? (
          // Case 1: Not logged in -> Show ONLY Login page
          <>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : (
          // Case 2: Logged in -> Show Admin Dashboard
          <>
            <Route path='/' element={<Home />} />
            <Route path='/add' element={<Add />} />
            <Route path='/lists' element={<Lists />} />
            <Route path='/orders' element={<Orders />} />
            {/* Redirect /login to home if they are already logged in */}
            <Route path='/login' element={<Navigate to="/" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </>
  )
}

export default App