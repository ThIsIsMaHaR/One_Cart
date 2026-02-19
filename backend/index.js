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
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

// Required for ES Modules to handle directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let port = process.env.PORT || 6000
let app = express()

// Middleware
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "https://one-cart-m543.onrender.com"],
  credentials: true
}))

// 1. API Routes (Must come first)
app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/product", productRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/order", orderRoutes)

// 2. Serve Static Files
// This points to your frontend build folder
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// 3. FIX FOR EXPRESS 5: Named Wildcard Catch-all
// We use {*any} because Express 5.x no longer accepts a plain "*"
app.get("/{*any}", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
});

// Start Server
app.listen(port, () => {
  console.log(`Hello From Server on port ${port}`)
  connectDb()
})