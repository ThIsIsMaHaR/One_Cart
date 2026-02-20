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

const port = process.env.PORT || 10000
const app = express()

app.use(express.json())
app.use(cookieParser())

// Allow same-origin requests
app.use(cors({
  origin: true, 
  credentials: true
}));

// --- 1. API ROUTES (Data stays at the top) ---
app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/product", productRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/order", orderRoutes)


// --- 2. ADMIN PANEL DEPLOYMENT ---
// This serves the Admin dashboard when you go to /admin
const adminPath = path.resolve(__dirname, "..", "admin", "dist");
app.use("/admin", express.static(adminPath));

app.get("/admin*", (req, res) => {
  res.sendFile(path.join(adminPath, "index.html"));
});


// --- 3. USER FRONTEND DEPLOYMENT ---
// This serves the main shop for everything else
const frontendPath = path.resolve(__dirname, "..", "frontend", "dist");
app.use(express.static(frontendPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`)
  connectDb()
})