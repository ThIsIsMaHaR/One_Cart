import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import AdminContextProvider from './context/AdminContext.jsx' // 👈 No curly braces here!

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AdminContextProvider> 
        <App />
      </AdminContextProvider>
    </BrowserRouter>
  </StrictMode>
)