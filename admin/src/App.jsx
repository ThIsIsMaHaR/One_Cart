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
  const context = useContext(adminDataContext);
  
  // Safe check for context to prevent white screen
  if (!context) {
    return <div className="text-white bg-[#0c2025] h-screen flex items-center justify-center">Context Loading Error...</div>;
  }

  const { adminData, getAdmin } = context;
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const verify = async () => {
      await getAdmin();
      setCheckingAuth(false);
    };
    verify();
  }, []);

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
        {/* If Not Logged In */}
        {!adminData ? (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : (
          /* If Logged In */
          <>
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

export default App;