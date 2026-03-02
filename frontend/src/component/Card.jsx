import React from 'react'
import { useNavigate } from 'react-router-dom'

function Card({ id, name, price, image }) {

  const navigate = useNavigate()

  return (
    <div 
      onClick={() => navigate(`/product/${id}`)} 
      className='w-[230px] h-[350px] bg-slate-700 rounded-md p-2 cursor-pointer hover:scale-105 transition'
    >
      <div className='w-full h-[80%] overflow-hidden'>
        <img 
          src={image} 
          alt={name} 
          className='w-full h-full object-cover rounded-sm'
        />
      </div>

      <div className='mt-2 text-white'>
        <p className='text-[16px]'>{name}</p>
        <p className='text-[14px]'>₹ {price}</p>
      </div>
    </div>
  )
}

export default Card