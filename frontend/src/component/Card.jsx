import React, { useContext } from 'react'
import { shopDataContext } from '../context/ShopContext'
import { useNavigate } from 'react-router-dom'

function Card({ name, image, id, price }) {
    const { currency } = useContext(shopDataContext)
    const navigate = useNavigate()

    return (
        <div 
            className='w-[300px] max-w-[90%] h-[400px] bg-[#ffffff0a] backdrop-blur-lg rounded-lg hover:scale-[102%] transition-transform flex flex-col p-[10px] cursor-pointer border border-[#80808049]'
            onClick={() => navigate(`/productdetail/${id}`)}
        >
            <img 
                src={image} 
                alt={name} 
                className='w-full h-[80%] rounded-sm object-cover'
            />

            <div className='text-[#c3f6fa] text-[18px] py-[10px]'>
                {name}
            </div>

            <div className='text-[#f3fafa] text-[14px]'>
                {currency} {price}
            </div>
        </div>
    )
}

export default Card