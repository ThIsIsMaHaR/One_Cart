import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AuthContext from './context/AuthContext.jsx'
import AdminContext from './context/AdminContext.jsx'
import axios from 'axios' // 1. Add this import

// 2. Add this line - it's essential for keeping you logged in on Render
axios.defaults.withCredentials = true;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename="/admin">
      <AuthContext>
        <AdminContext>
          <App />
        </AdminContext>
      </AuthContext>
    </BrowserRouter>
  </StrictMode>
)