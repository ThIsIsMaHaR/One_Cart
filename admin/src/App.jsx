import React, { useContext } from 'react'
import Navbar from './component/Nav' // Aapka Nav component path
import Sidebar from './component/Sidebar'
import { Routes, Route, Navigate } from 'react-router-dom'
import Add from './pages/Add'
import Lists from './pages/Lists'
import Orders from './pages/Orders'
import Login from './pages/Login' // Ensure path is correct
import { adminDataContext } from './context/AdminContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  const { adminData, loading } = useContext(adminDataContext);

  // Agar backend se verification chal raha hai, tabhi spinner dikhao
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c2025]">
         <div className="animate-spin h-10 w-10 border-4 border-[#46d1f7] border-t-transparent rounded-full"></div>
         <p className="text-white ml-3">Verifying Admin...</p>
      </div>
    )
  }

  return (
    <div className='bg-[#0c2025] min-h-screen'>
      <ToastContainer />
      
      {!adminData ? (
        <Routes>
          <Route path="*" element={<Login />} />
        </Routes>
      ) : (
        <>
          <Navbar />
          <div className='flex w-full'>
            <Sidebar />
            <div className='w-full'>
              <Routes>
                <Route path='/' element={<Navigate to="/lists" />} />
                <Route path='/add' element={<Add />} />
                <Route path='/lists' element={<Lists />} />
                <Route path='/orders' element={<Orders />} />
                <Route path="*" element={<Navigate to="/lists" />} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default App