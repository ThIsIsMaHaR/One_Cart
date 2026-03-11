import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AdminContextProvider from './context/AdminContext.jsx' 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      {/* 👈 Provider hamesha App ke upar hona chahiye */}
      <AdminContextProvider> 
        <App />
      </AdminContextProvider>
    </BrowserRouter>
  </StrictMode>
)