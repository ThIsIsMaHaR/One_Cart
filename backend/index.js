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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let port = process.env.PORT || 10000
let app = express()

// Middleware
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "https://onecart-62p0.onrender.com"],
  credentials: true
}))

// 1. API Routes
app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/product", productRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/order", orderRoutes)

// 2. Serve Static Files
// This path moves up from 'backend' to root, then into 'frontend/dist'
const frontendPath = path.resolve(__dirname, "..", "frontend", "dist");
app.use(express.static(frontendPath));

// 3. Catch-all Route
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"), (err) => {
    if (err) {
      // If the file is missing, the build failed or path is wrong
      res.status(500).send("Frontend build not found. Please check Render build logs.");
    }
  });
});

// Start Server
app.listen(port, () => {
  console.log(`Hello From Server on port ${port}`)
  connectDb()
})