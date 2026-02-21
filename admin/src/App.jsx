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
        if (getAdmin) {
          await getAdmin();
        }
      } catch (error) {
        console.error("Auth check failed", error);
      } finally {
        setCheckingAuth(false);
      }
    };
    verifyAdmin();
  }, [getAdmin]);

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
      <Routes>
        {/* If not logged in, any path shows Login */}
        {!adminData ? (
          <Route path="*" element={<Login />} />
        ) : (
          <>
            {/* Note: with basename="/admin", path="/" actually means "/admin/" */}
            <Route path='/' element={<Home />} />
            <Route path='/add' element={<Add />} />
            <Route path='/lists' element={<Lists />} />
            <Route path='/orders' element={<Orders />} />
            <Route path='/login' element={<Navigate to="/" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </>
  )
}

export default App