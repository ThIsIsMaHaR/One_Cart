import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
// FIX: Added curly braces to these imports
import { AuthContextProvider } from './context/AuthContext.jsx'
import { UserContextProvider } from './context/UserContext.jsx'
import { ShopContextProvider } from './context/ShopContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthContextProvider>
      <UserContextProvider>
        <ShopContextProvider>
          <App />
        </ShopContextProvider>
      </UserContextProvider>
    </AuthContextProvider>
  </BrowserRouter>
)