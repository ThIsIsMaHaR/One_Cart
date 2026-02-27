import express from "express"
import { adminLogin, googleLogin, login, logOut, registration, getAdmin } from "../controllers/authController.js"

const authRouter = express.Router()

authRouter.post("/registration", registration)
authRouter.post("/login", login)
authRouter.post("/logout", logOut) 
authRouter.post("/adminlogin", adminLogin)
authRouter.get("/getadmin", getAdmin) 
authRouter.post("/googlelogin", googleLogin)

export default authRouter