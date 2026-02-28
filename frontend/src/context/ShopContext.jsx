import React, { createContext, useState } from "react";

// 1. Export the context as 'shopDataContext' to match Card.jsx
export const shopDataContext = createContext();

// 2. Export the provider as 'ShopContextProvider' to match main.jsx
export const ShopContextProvider = (props) => {
    const currency = '₹';
    const delivery_fee = 50;
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});

    const value = {
        currency, 
        delivery_fee,
        search, setSearch,
        showSearch, setShowSearch,
        cartItems, setCartItems
    };

    return (
        <shopDataContext.Provider value={value}>
            {props.children}
        </shopDataContext.Provider>
    );
};