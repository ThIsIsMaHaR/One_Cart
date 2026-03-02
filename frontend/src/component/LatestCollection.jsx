import React, { useContext, useEffect, useState } from 'react'
import Title from './Title'
import { shopDataContext } from '../context/ShopContext'
import Card from './Card'

function LatestCollection() {

  const { products } = useContext(shopDataContext)
  const [latestProducts, setLatestProducts] = useState([])

  useEffect(() => {
    if (Array.isArray(products)) {
      setLatestProducts(products.slice(0, 8))
    }
  }, [products])

  return (
    <div className="w-full py-10">

      <div className="text-center">
        <Title text1={"LATEST"} text2={"COLLECTIONS"} />
        <p className="mt-2 text-sm md:text-lg text-blue-100 px-4">
          Step Into Style – New Collection Dropping This Season!
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
          latestProducts.map((item, index) => (
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

export default LatestCollection