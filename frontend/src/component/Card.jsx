import React, { useContext } from 'react'
import { shopDataContext } from '../context/ShopContext'
import { useNavigate } from 'react-router-dom'

function Card({ name, image, id, price }) {

  const { currency } = useContext(shopDataContext)
  const navigate = useNavigate()

  return (
    <div
      className="w-full sm:w-[260px] md:w-[280px] lg:w-[300px] 
                 h-[380px] bg-[#ffffff0a] backdrop-blur-lg 
                 rounded-xl hover:scale-[1.03] transition-all duration-300 
                 flex flex-col p-3 cursor-pointer 
                 border border-[#80808049]"
      onClick={() => navigate(`/productdetail/${id}`)}
    >
      <img
        src={image}
        alt={name}
        className="w-full h-[75%] rounded-md object-cover"
      />

      <div className="mt-3 text-[#c3f6fa] text-lg font-medium truncate">
        {name}
      </div>

      <div className="text-[#f3fafa] text-sm">
        {currency} {price}
      </div>
    </div>
  )
}

export default Card