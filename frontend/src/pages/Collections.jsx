import React, { useContext, useEffect, useState } from 'react'
import Title from '../component/Title'
import { shopDataContext } from '../context/ShopContext'
import Card from '../component/Card'

function Collections() {

  const { products, search, showSearch } = useContext(shopDataContext)

  const [filterProduct, setFilterProduct] = useState([])
  const [category, setCategory] = useState([])
  const [subCategory, setSubCategory] = useState([])
  const [sortType, setSortType] = useState("relavent")

  const applyFilter = () => {

    let productCopy = Array.isArray(products) ? [...products] : []

    if (showSearch && search) {
      productCopy = productCopy.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (category.length > 0) {
      productCopy = productCopy.filter(item =>
        category.includes(item.category)
      )
    }

    if (subCategory.length > 0) {
      productCopy = productCopy.filter(item =>
        subCategory.includes(item.subCategory)
      )
    }

    if (sortType === "low-high") {
      productCopy.sort((a, b) => a.price - b.price)
    } else if (sortType === "high-low") {
      productCopy.sort((a, b) => b.price - a.price)
    }

    setFilterProduct(productCopy)
  }

  useEffect(() => {
    applyFilter()
  }, [products, category, subCategory, search, sortType])

  return (
    <div className="
      w-full min-h-screen 
      bg-gradient-to-l from-[#141414] to-[#0c2025] 
      pt-24 pb-16
    ">

      <div className="text-center">
        <Title text1={"ALL"} text2={"COLLECTIONS"} />
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
          filterProduct.map((item, index) => (
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

export default Collections