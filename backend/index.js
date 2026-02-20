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

// --- 1. ENHANCED CORS SETUP ---
// This allows both your main frontend and your backend/admin URL to talk to each other
app.use(cors({
  origin: [
    'https://e-comm-onecart.onrender.com', 
    'https://onecart-62p0.onrender.com'
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// --- 2. API ROUTES ---
app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/product", productRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/order", orderRoutes)


// --- 3. ADMIN PANEL DEPLOYMENT ---
const adminPath = path.resolve(__dirname, "..", "admin", "dist");
app.use("/admin", express.static(adminPath));

// Fix: This ensures refreshing any admin page works correctly
app.get("/admin/*", (req, res) => {
  res.sendFile(path.join(adminPath, "index.html"));
});


// --- 4. USER FRONTEND DEPLOYMENT ---
const frontendPath = path.resolve(__dirname, "..", "frontend", "dist");
app.use(express.static(frontendPath));

app.get("*", (req, res) => {
  // If the request is for an admin route but reached here, redirect back to admin logic
  if (req.originalUrl.startsWith('/admin')) {
    return res.sendFile(path.join(adminPath, "index.html"));
  }
  res.sendFile(path.join(frontendPath, "index.html"));
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`)
  connectDb()
})