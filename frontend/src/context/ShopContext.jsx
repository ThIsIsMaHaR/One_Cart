import React, { createContext, useState } from "react";

// The Context itself
export const ShopContext = createContext();

// The Provider (This is what main.jsx is looking for)
export const ShopContextProvider = (props) => {

    const currency = '₹';
    const delivery_fee = 50;
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});

    // Add any other shop logic you have here...

    const value = {
        currency, 
        delivery_fee,
        search, setSearch,
        showSearch, setShowSearch,
        cartItems, setCartItems
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};