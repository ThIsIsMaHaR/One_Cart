import React, { useContext, useEffect, useState } from 'react'
import Nav from '../component/Nav'
import Sidebar from '../component/Sidebar'
import { adminDataContext } from '../context/AdminContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FiTrash2 } from 'react-icons/fi' // Trash icon for better UI

function Lists() {
  const [list, setList] = useState([])
  const { serverUrl } = useContext(adminDataContext)

  const fetchList = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/product/list`, { withCredentials: true })
      if (response.data?.success) {
        setList(response.data.products)
      }
    } catch (error) {
      toast.error("Could not load products")
    }
  }

  const removeList = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const response = await axios.post(`${serverUrl}/api/product/remove`, { id }, { withCredentials: true })
      if (response.data.success) {
        toast.success("Product removed")
        fetchList()
      }
    } catch (error) {
      toast.error("Error removing product")
    }
  }

  useEffect(() => {
    if (serverUrl) fetchList()
  }, [serverUrl])

  return (
    <div className='w-full min-h-screen bg-[#0c2025] text-white flex flex-col'>
      <Nav />
      <div className='flex flex-1'>
        <Sidebar />
        
        {/* Main Content Area */}
        <div className='flex-1 lg:ml-[280px] md:ml-[200px] mt-[70px] p-6 md:p-10'>
          <div className='max-w-6xl mx-auto'>
            <h2 className='text-3xl md:text-4xl font-bold mb-8 text-[#46d1f7]'>Inventory Management</h2>

            {/* Header for Desktop */}
            <div className='hidden md:grid grid-cols-[1fr_2fr_1fr_1fr_0.5fr] items-center py-4 px-6 bg-[#1a3036] rounded-t-xl border-b border-gray-700 font-bold text-sm uppercase tracking-wider'>
              <p>Image</p>
              <p>Product Details</p>
              <p>Category</p>
              <p>Price</p>
              <p className='text-center'>Action</p>
            </div>

            {/* Product List */}
            <div className='flex flex-col gap-4 md:gap-0'>
              {list.length > 0 ? (
                list.map((item) => (
                  <div 
                    key={item._id} 
                    className='grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr_1fr_0.5fr] items-center gap-4 py-4 px-6 bg-[#14282e] md:border-b border-gray-800 hover:bg-[#1c353d] transition-all rounded-xl md:rounded-none'
                  >
                    {/* Image Section */}
                    <div className='flex gap-2 overflow-x-auto'>
                      <img 
                        src={item.image?.[0] || 'https://via.placeholder.com/100'} 
                        className='w-20 h-20 object-cover rounded-lg border border-gray-700' 
                        alt={item.name} 
                      />
                    </div>

                    {/* Details Section */}
                    <div className='flex flex-col'>
                      <p className='text-lg font-semibold text-[#bef0f3]'>{item.name}</p>
                      <div className='flex gap-2 mt-1'>
                        {item.sizes?.map(size => (
                          <span key={size} className='text-[10px] bg-[#0c2025] px-2 py-1 rounded border border-gray-700'>{size}</span>
                        ))}
                      </div>
                    </div>

                    {/* Category */}
                    <p className='text-gray-400 md:text-white'>
                      <span className='md:hidden font-bold'>Category: </span> {item.category}
                    </p>

                    {/* Price */}
                    <p className='text-xl font-bold text-[#46d1f7]'>
                      <span className='md:hidden text-white font-normal text-base'>Price: </span> ₹{item.price}
                    </p>

                    {/* Action */}
                    <div className='flex justify-center'>
                      <button 
                        onClick={() => removeList(item._id)}
                        className='p-3 bg-red-500/10 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all group'
                        title="Delete Product"
                      >
                        <FiTrash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className='py-20 text-center bg-[#14282e] rounded-b-xl border border-dashed border-gray-700'>
                  <p className='text-gray-500 italic'>No products found in your inventory.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Lists