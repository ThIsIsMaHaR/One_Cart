import express from "express"
import { 
    adminLogin, 
    googleLogin, 
    login, 
    logOut, 
    registration,
    getAdmin // I added this - you'll need it for the 'getadmin' call in AdminContext
} from "../controllers/authController.js"

const authRouter = express.Router()

// User Routes
authRouter.post("/registration", registration)
authRouter.post("/login", login)

// Admin & Auth Management
// CHANGED: Using POST for logout to match your AdminContext.jsx call
authRouter.post("/logout", logOut) 
authRouter.post("/adminlogin", adminLogin)

// IMPORTANT: This matches the 'getAdmin' call in your AdminContext.jsx
// Make sure you have a 'getAdmin' function exported in your authController.js!
authRouter.get("/getadmin", getAdmin) 

authRouter.post("/googlelogin", googleLogin)

export default authRouter