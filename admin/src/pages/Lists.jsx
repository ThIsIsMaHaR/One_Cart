import React, { useContext, useEffect, useState } from 'react'
import Nav from '../component/Nav'
import Sidebar from '../component/Sidebar'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { toast } from 'react-toastify'

function Lists() {
  // Initialize as empty array to prevent .map or .slice crashes
  const [list, setList] = useState([])
  const { serverUrl } = useContext(authDataContext)

  const fetchList = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/product/list`)
      
      // Safety check: ensure we are setting an array
      if (response.data && response.data.success && Array.isArray(response.data.products)) {
        setList(response.data.products)
      } else if (Array.isArray(response.data)) {
        // Fallback for old backend format
        setList(response.data)
      } else {
        console.error("Data format incorrect:", response.data)
        setList([]) 
      }
    } catch (error) {
      console.error("Fetch error:", error)
      toast.error("Could not load products")
      setList([]) // Ensure state remains an array on error
    }
  }

  const removeList = async (id) => {
    try {
      // Sending id in the body to match modern API standards
      const response = await axios.post(`${serverUrl}/api/product/remove`, { id }, { withCredentials: true })

      if (response.data.success) {
        toast.success("Product removed")
        fetchList()
      } else {
        toast.error(response.data.message || "Failed to remove product")
      }
    } catch (error) {
      console.error("Remove error:", error)
      toast.error("Error removing product")
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  return (
    <div className='w-[100vw] min-h-[100vh] bg-gradient-to-l from-[#141414] to-[#0c2025] text-[white]'>
      <Nav />
      <div className='w-[100%] h-[100%] flex items-center justify-start'>
        <Sidebar />

        <div className='w-[82%] h-[100%] lg:ml-[320px] md:ml-[230px] mt-[70px] flex flex-col gap-[30px] overflow-x-hidden py-[50px] ml-[100px]'>
          <div className='w-[400px] h-[50px] text-[28px] md:text-[40px] mb-[20px] text-white'>
            All Listed Products
          </div>

          {/* Using optional chaining ?. to prevent crashes */}
          {list?.length > 0 ? (
            list.map((item, index) => (
              <div 
                className='w-[90%] md:h-[120px] h-[90px] bg-slate-600 rounded-xl flex items-center justify-start gap-[5px] md:gap-[30px] p-[10px] md:px-[30px]' 
                key={item._id || index}
              >
                <img 
                  src={item.image && item.image[0] ? item.image[0] : ""} 
                  className='w-[30%] md:w-[120px] h-[90%] rounded-lg object-cover' 
                  alt={item.name} 
                />
                
                <div className='w-[90%] h-[80%] flex flex-col items-start justify-center gap-[2px]'>
                  <div className='w-[100%] md:text-[20px] text-[15px] text-[#bef0f3] truncate'>
                    {item.name}
                  </div>
                  <div className='md:text-[17px] text-[15px] text-[#bef3da]'>
                    {item.category}
                  </div>
                  <div className='md:text-[17px] text-[15px] text-[#bef3da]'>
                    ₹{item.price}
                  </div>
                </div>

                <div className='w-[10%] h-[100%] bg-transparent flex items-center justify-center'>
                  <span 
                    className='w-[35px] h-[35px] flex items-center justify-center rounded-md hover:bg-red-500 hover:text-white transition-all cursor-pointer' 
                    onClick={() => removeList(item._id)}
                  >
                    X
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className='text-white text-lg'>No products available.</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Lists