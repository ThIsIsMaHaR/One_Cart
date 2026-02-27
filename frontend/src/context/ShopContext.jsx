import React, { createContext, useContext, useEffect, useState } from 'react'
import { authDataContext } from './AuthContext'
import axios from 'axios'
import { userDataContext } from './UserContext'
import { toast } from 'react-toastify'

export const shopDataContext = createContext()

function ShopContext({ children }) {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const { userData } = useContext(userDataContext)
  const [showSearch, setShowSearch] = useState(false)
  const { serverUrl } = useContext(authDataContext) 
  const [cartItem, setCartItem] = useState({})
  const [loading, setLoading] = useState(false)
  const currency = '₹';
  const delivery_fee = 40;

  // UPDATED: Added withCredentials to the GET request
  const getProducts = async () => {
    try {
      const result = await axios.get(serverUrl + "/api/product/list", { withCredentials: true })
      if (result.data.success) {
        setProducts(result.data.products)
      } else {
        setProducts(Array.isArray(result.data) ? result.data : [])
      }
    } catch (error) {
      console.log("Fetch products error:", error)
      setProducts([])
    }
  }

  const addtoCart = async (itemId, size) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }

    let cartData = structuredClone(cartItem);

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    setCartItem(cartData);

    if (userData) {
      setLoading(true)
      try {
        await axios.post(serverUrl + "/api/cart/add", { itemId, size }, { withCredentials: true })
        toast.success("Product Added")
        setLoading(false)
      }
      catch (error) {
        console.log(error)
        setLoading(false)
        toast.error("Add Cart Error")
      }
    }
  }

  const getUserCart = async () => {
    try {
      const result = await axios.post(serverUrl + '/api/cart/get', {}, { withCredentials: true })
      setCartItem(result.data || {})
    } catch (error) {
      console.log("Get cart error:", error)
    }
  }

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItem);
    if(cartData[itemId] && cartData[itemId][size]) {
        cartData[itemId][size] = quantity
        setCartItem(cartData)
    }

    if (userData) {
      try {
        await axios.post(serverUrl + "/api/cart/update", { itemId, size, quantity }, { withCredentials: true })
      } catch (error) {
        console.log(error)
      }
    }
  }

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItem) {
      for (const item in cartItem[items]) {
        try {
          if (cartItem[items][item] > 0) {
            totalCount += cartItem[items][item]
          }
        } catch (error) { }
      }
    }
    return totalCount
  }

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItem) {
      let itemInfo = products.find((product) => product._id === items);
      if (itemInfo) {
        for (const item in cartItem[items]) {
          try {
            if (cartItem[items][item] > 0) {
              totalAmount += itemInfo.price * cartItem[items][item];
            }
          } catch (error) { }
        }
      }
    }
    return totalAmount
  }

  useEffect(() => {
    if (serverUrl) {
      getProducts()
    }
  }, [serverUrl]) // Depend on serverUrl to ensure it's loaded

  useEffect(() => {
    if (userData && serverUrl) {
      getUserCart()
    }
  }, [userData, serverUrl])

  const value = {
    products, currency, delivery_fee, getProducts, 
    search, setSearch, showSearch, setShowSearch, 
    cartItem, addtoCart, getCartCount, setCartItem, 
    updateQuantity, getCartAmount, loading, serverUrl
  }

  return (
    <shopDataContext.Provider value={value}>
      {children}
    </shopDataContext.Provider>
  )
}

export default ShopContext