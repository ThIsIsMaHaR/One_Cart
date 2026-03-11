import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AdminContext from './context/AdminContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* BrowserRouter bina basename ke taaki '/' se shuru ho sake */}
    <BrowserRouter>
      <AdminContext>
        <App />
      </AdminContext>
    </BrowserRouter>
  </StrictMode>
)