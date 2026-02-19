import express from 'express'
import dotenv from 'dotenv'
import connectDb from './config/db.js'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/authRoutes.js'
import cors from "cors"
import userRoutes from './routes/userRoutes.js'
import productRoutes from './routes/productRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import path from 'path' // Added for path handling
import { fileURLToPath } from 'url' // Added for ES Modules pathing

dotenv.config()

// These two lines are needed to handle paths in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let port = process.env.PORT || 6000
let app = express()

app.use(express.json())
app.use(cookieParser())

// Updated CORS to allow your Render URLs
app.use(cors({
 origin:["http://localhost:5173", "http://localhost:5174", "https://one-cart-m543.onrender.com"],
 credentials:true
}))

// API ROUTES
app.use("/api/auth",authRoutes)
app.use("/api/user",userRoutes)
app.use("/api/product",productRoutes)
app.use("/api/cart",cartRoutes)
app.use("/api/order",orderRoutes)

// --- FRONTEND SERVING CODE ---
// 1. Serve static files from the frontend/dist folder
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// 2. The "Catch-all" route: If no API route matches, send the React index.html
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
});
// -----------------------------

app.listen(port,()=>{
    console.log("Hello From Server")
    connectDb()
})