import React, { useState, useContext, useEffect } from 'react'
import Nav from '../component/Nav'
import Sidebar from '../component/Sidebar'
// 🚀 FIX: Correct Context Import
import { adminDataContext } from '../context/AdminContext'
import axios from 'axios'
import { SiEbox } from "react-icons/si";
import { toast } from 'react-toastify'

function Orders() {
  const [orders, setOrders] = useState([])
  // 🚀 FIX: Use adminDataContext instead of authDataContext
  const { serverUrl } = useContext(adminDataContext)

  const fetchAllOrders = async () => {
    try {
      if (!serverUrl) return; // Wait until serverUrl is available
      const result = await axios.post(serverUrl + '/api/order/list', {}, { withCredentials: true })
      
      // Safety check for data structure
      if (result.data) {
        setOrders(result.data.reverse())
      }
    } catch (error) {
      console.error("Fetch Error:", error)
      toast.error("Failed to load orders")
    }
  }

  const statusHandler = async (e, orderId) => {
    try {
      const result = await axios.post(serverUrl + '/api/order/status', 
        { orderId, status: e.target.value }, 
        { withCredentials: true }
      )
      if (result.data.success) {
        toast.success("Status Updated")
        await fetchAllOrders()
      }
    } catch (error) {
      console.error("Status Update Error:", error)
      toast.error("Error updating status")
    }
  }

  useEffect(() => {
    if (serverUrl) {
      fetchAllOrders()
    }
  }, [serverUrl])

  return (
    <div className='w-full min-h-screen bg-[#0c2025] text-white flex flex-col'>
      <Nav />
      <div className='flex flex-1'>
        <Sidebar />
        
        {/* Main Content Area */}
        <div className='flex-1 lg:ml-[280px] md:ml-[200px] mt-[70px] p-6 md:p-10'>
          <div className='max-w-6xl mx-auto'>
            <h2 className='text-3xl md:text-4xl font-bold mb-8 text-[#46d1f7]'>Customer Orders</h2>

            <div className='flex flex-col gap-6'>
              {orders.length > 0 ? (
                orders.map((order, index) => (
                  <div key={index} className='grid grid-cols-1 lg:grid-cols-[0.5fr_2fr_1fr_1fr] items-start gap-6 p-6 bg-[#14282e] border border-gray-800 rounded-2xl hover:border-[#46d1f7]/50 transition-all'>
                    
                    {/* Icon Section */}
                    <div className='hidden lg:flex items-center justify-center'>
                      <SiEbox className='w-14 h-14 text-[#46d1f7] p-3 rounded-xl bg-[#0c2025] border border-gray-700' />
                    </div>

                    {/* Order Details */}
                    <div>
                      <div className='mb-4'>
                        {order.items.map((item, idx) => (
                          <p key={idx} className='text-[#56dbfc] font-semibold'>
                            {item.name.toUpperCase()} x {item.quantity} 
                            <span className='ml-2 text-xs bg-gray-700 px-2 py-1 rounded text-white'>{item.size}</span>
                            {idx !== order.items.length - 1 && ","}
                          </p>
                        ))}
                      </div>
                      
                      <div className='text-sm text-gray-300 bg-[#0c2025]/50 p-3 rounded-lg border border-gray-800'>
                        <p className='font-bold text-white mb-1'>{order.address.firstName + " " + order.address.lastName}</p>
                        <p>{order.address.street}, {order.address.city}</p>
                        <p>{order.address.state}, {order.address.country} - {order.address.pinCode}</p>
                        <p className='text-[#46d1f7] mt-1'>{order.address.phone}</p>
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className='text-sm flex flex-col gap-1 border-l border-gray-800 lg:pl-6'>
                      <p><span className='text-gray-400'>Items:</span> {order.items.length}</p>
                      <p><span className='text-gray-400'>Method:</span> {order.paymentMethod}</p>
                      <p><span className='text-gray-400'>Payment:</span> 
                        <span className={order.payment ? 'text-green-400 ml-1' : 'text-yellow-400 ml-1'}>
                          {order.payment ? 'Done' : 'Pending'}
                        </span>
                      </p>
                      <p><span className='text-gray-400'>Date:</span> {new Date(order.date).toLocaleDateString()}</p>
                      <p className='text-xl font-bold text-white mt-2'>₹{order.amount}</p>
                    </div>

                    {/* Status Handler */}
                    <div className='flex items-center lg:justify-end'>
                      <select 
                        value={order.status} 
                        className='w-full lg:w-auto px-4 py-3 bg-[#0c2025] text-white rounded-xl border border-[#46d1f7]/30 focus:border-[#46d1f7] outline-none cursor-pointer font-medium'
                        onChange={(e) => statusHandler(e, order._id)}
                      >
                        <option value="Order Placed">Order Placed</option>
                        <option value="Packing">Packing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for delivery">Out for delivery</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>

                  </div>
                ))
              ) : (
                <div className='py-20 text-center bg-[#14282e] rounded-2xl border border-dashed border-gray-700'>
                  <p className='text-gray-500'>No orders found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Orders