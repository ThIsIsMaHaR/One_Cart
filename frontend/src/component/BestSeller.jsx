import React, { useContext, useEffect, useState } from 'react'
import Title from './Title'
import { shopDataContext } from '../context/ShopContext'
import Card from './Card'

function BestSeller() {

  const { products } = useContext(shopDataContext)
  const [bestSeller, setBestSeller] = useState([])

  useEffect(() => {
    if (Array.isArray(products)) {
      const filtered = products.filter(item => item.bestseller === true)
      setBestSeller(filtered.slice(0, 4))
    }
  }, [products])

  return (
    <div className="w-full py-10">

      <div className="text-center">
        <Title text1={"BEST"} text2={"SELLER"} />
        <p className="mt-2 text-sm md:text-lg text-blue-100 px-4">
          Tried, Tested, Loved – Discover Our All-Time Best Sellers.
        </p>
      </div>

      <div className="
        mt-10 
        grid 
        grid-cols-1 
        sm:grid-cols-2 
        md:grid-cols-3 
        lg:grid-cols-4 
        gap-8 
        px-6
      ">
        {
          bestSeller.map((item, index) => (
            <Card
              key={index}
              id={item._id}
              name={item.name}
              price={item.price}
              image={item.image?.[0] || ""}
            />
          ))
        }
      </div>

    </div>
  )
}

export default BestSeller