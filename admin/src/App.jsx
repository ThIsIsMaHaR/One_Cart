import React, { useContext } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Routes, Route } from 'react-router-dom'
import Add from './pages/Add'
import Lists from './pages/Lists'
import Orders from './pages/Orders'
import Login from './components/Login'
import { adminDataContext } from './context/AdminContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  const { adminData, loading } = useContext(adminDataContext);

  // 🚀 FIX: Agar context fetch ho raha hai, toh spinner dikhao
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c2025]">
        <div className="animate-spin h-12 w-12 border-4 border-[#46d1f7] border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className='bg-[#0c2025] min-h-screen'>
      <ToastContainer />
      {!adminData ? (
        <Login />
      ) : (
        <>
          <Navbar />
          <div className='flex w-full'>
            <Sidebar />
            <div className='flex-1'>
              <Routes>
                <Route path='/add' element={<Add />} />
                <Route path='/lists' element={<Lists />} />
                <Route path='/orders' element={<Orders />} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default App