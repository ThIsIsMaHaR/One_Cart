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
        <div>
            <div className='h-[8%] w-[100%] text-center md:mt-[50px]'>
                <Title text1={"LATEST"} text2={"COLLECTIONS"} />
                <p className='w-[100%] m-auto text-[13px] md:text-[20px] px-[10px] text-blue-100'>
                    Step Into Style – New Collection Dropping This Season!
                </p>
            </div>

            <div className='w-[100%] mt-[30px] flex items-center justify-center flex-wrap gap-[50px]'>
                {
                    latestProducts.map((item, index) => (
                        <Card
                            key={index}
                            id={item._id}
                            name={item.name}
                            price={item.price}
                            image={item.image && item.image[0] ? item.image[0] : ""}
                        />
                    ))
                }
            </div>
        </div>
    )
}

export default LatestCollection