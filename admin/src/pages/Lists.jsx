import React, { useContext, useEffect, useState } from 'react'
import Nav from '../component/Nav'
import Sidebar from '../component/Sidebar'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { toast } from 'react-toastify'

function Lists() {
  const [list, setList] = useState([])
  const { serverUrl } = useContext(authDataContext)

  // Fetch products from backend
  const fetchList = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/product/list`)
      
      if (response.data?.success && Array.isArray(response.data.products)) {
        setList(response.data.products)
      } else {
        setList([])
        console.error("Unexpected data format:", response.data)
      }
    } catch (error) {
      console.error("Fetch error:", error)
      toast.error("Could not load products")
      setList([])
    }
  }

  // Remove a product
  const removeList = async (id) => {
    try {
      const response = await axios.post(
        `${serverUrl}/api/product/remove`,
        { id },
        { withCredentials: true }
      )

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
    <div className='w-[100vw] min-h-[100vh] bg-gradient-to-l from-[#141414] to-[#0c2025] text-white'>
      <Nav />
      <div className='w-[100%] h-[100%] flex items-start'>
        <Sidebar />

        <div className='w-[82%] h-[100%] lg:ml-[320px] md:ml-[230px] mt-[70px] flex flex-col gap-[30px] overflow-x-hidden py-[50px] ml-[100px]'>
          <div className='w-[400px] h-[50px] text-[28px] md:text-[40px] mb-[20px] text-white'>
            All Listed Products
          </div>

          {list?.length > 0 ? (
            list.map((item, index) => (
              <div 
                key={item._id || index} 
                className='w-[90%] md:h-[150px] h-[120px] bg-slate-600 rounded-xl flex items-center justify-start gap-[5px] md:gap-[30px] p-[10px] md:px-[30px]'
              >
                {/* Display all images for the product */}
                <div className='flex gap-2 w-[30%] h-full overflow-x-auto'>
                  {item.image?.length > 0 ? (
                    item.image.map((img, idx) => (
                      <img 
                        key={idx}
                        src={img}
                        alt={item.name}
                        className='w-[80px] md:w-[100px] h-full object-cover rounded-lg'
                      />
                    ))
                  ) : (
                    <img 
                      src='https://via.placeholder.com/100'
                      alt='placeholder'
                      className='w-[80px] md:w-[100px] h-full object-cover rounded-lg'
                    />
                  )}
                </div>

                {/* Product Details */}
                <div className='w-[60%] h-full flex flex-col justify-center gap-[5px]'>
                  <div className='md:text-[20px] text-[16px] text-[#bef0f3] truncate font-semibold'>
                    {item.name}
                  </div>
                  <div className='md:text-[17px] text-[15px] text-[#bef3da]'>
                    Category: {item.category}
                  </div>
                  <div className='md:text-[17px] text-[15px] text-[#bef3da]'>
                    ₹{item.price}
                  </div>
                  {item.sizes?.length > 0 && (
                    <div className='md:text-[15px] text-[13px] text-[#bef3da]'>
                      Sizes: {item.sizes.join(', ')}
                    </div>
                  )}
                  {item.bestseller && (
                    <div className='text-[#46d1f7] font-bold'>Bestseller</div>
                  )}
                </div>

                {/* Remove Button */}
                <div className='w-[10%] h-full flex items-center justify-center'>
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