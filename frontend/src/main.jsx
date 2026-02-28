import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

// Import names must match the "export default" from the files
import AuthContextProvider from './context/AuthContext.jsx'; 
import UserContext from './context/UserContext.jsx'
import ShopContext from './context/ShopContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      {/* Auth MUST be on the outside because UserContext needs its serverUrl */}
      <AuthContextProvider> 
        <UserContext>
          <ShopContext>
            <App />
          </ShopContext>
        </UserContext>
      </AuthContextProvider>
    </BrowserRouter>
  </StrictMode>
)