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

// 1. ABSOLUTE CORS FIX (Paste this exactly)
app.use(cors({
  origin: true, // This automatically mirrors the origin of the request
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept", "X-Requested-With"]
}));

// Explicitly handle preflight requests for all routes
app.options('*', cors());

// 2. Middlewares
app.use(express.json())
app.use(cookieParser())

// 3. API Routes
app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/product", productRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/order", orderRoutes)

// 4. Serving Frontend
const frontendPath = path.resolve(__dirname, "..", "frontend", "dist");
app.use(express.static(frontendPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Start Server
app.listen(port, () => {
  console.log(`Hello From Server on port ${port}`)
  connectDb()
})