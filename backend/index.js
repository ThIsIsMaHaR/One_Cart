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

dotenv.config()

const port = process.env.PORT || 10000
const app = express()

// 1. Middleware
app.use(express.json())
app.use(cookieParser())

// Updated CORS for same-domain deployment
app.use(cors({
  origin: true, 
  credentials: true
}));

// 2. API Routes
app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/product", productRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/order", orderRoutes)

// 3. Serve Static Files (Frontend build)
// process.cwd() ensures we start from the project root folder
const frontendPath = path.join(process.cwd(), "frontend", "dist");

// Check if static files are being served
app.use(express.static(frontendPath));

// 4. Catch-all Route
// This MUST be the last route. It serves index.html for any non-API request.
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"), (err) => {
    if (err) {
      res.status(500).send("Frontend build not found. Verify that 'frontend/dist' exists.");
    }
  });
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
  connectDb()
})