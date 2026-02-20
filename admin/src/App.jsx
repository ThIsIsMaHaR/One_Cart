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
  // Pull adminData and the getAdmin function from context
  const { adminData, getAdmin } = useContext(adminDataContext);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        if (getAdmin) {
          await getAdmin();
        }
      } catch (error) {
        console.error("Auth check failed", error);
      } finally {
        // Once the API call is done, we stop "loading"
        setCheckingAuth(false);
      }
    };
    verifyAdmin();
  }, [getAdmin]);

  // 1. Show a loading screen while checking if the user is logged in
  // This prevents the "flash" of the login page on refresh
  if (checkingAuth) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#0c2025] text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6060f5]"></div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      
      {/* 2. If no admin data, only show Login. If logged in, show the Dashboard Routes */}
      {!adminData ? (
        <Routes>
          <Route path="*" element={<Login />} />
        </Routes>
      ) : (
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/add' element={<Add />} />
          <Route path='/lists' element={<Lists />} />
          <Route path='/orders' element={<Orders />} />
          {/* Redirect from login back to home if already logged in */}
          <Route path='/login' element={<Navigate to="/" />} />
        </Routes>
      )}
    </>
  )
}

export default App