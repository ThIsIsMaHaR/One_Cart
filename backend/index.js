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

// --- 1. MIDDLEWARE SETUP ---
app.use(express.json())
app.use(express.urlencoded({ extended: true })) // Added this to help with form parsing
app.use(cookieParser())

// --- 2. ENHANCED CORS SETUP ---
// Move this ABOVE your routes
app.use(cors({
  origin: [
    'https://e-comm-onecart.onrender.com', // Your frontend
    'https://onecart-62p0.onrender.com'    // Your admin/backend
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Handle Pre-flight requests (Fixes many browser-side CORS blocks)
app.options('*', cors());

// --- 3. API ROUTES ---
app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/product", productRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/order", orderRoutes)

// --- 4. ADMIN PANEL DEPLOYMENT ---
const adminPath = path.resolve(__dirname, "..", "admin", "dist");
app.use("/admin", express.static(adminPath));

app.get("/admin/*", (req, res) => {
  res.sendFile(path.join(adminPath, "index.html"));
});

// --- 5. USER FRONTEND DEPLOYMENT ---
const frontendPath = path.resolve(__dirname, "..", "frontend", "dist");
app.use(express.static(frontendPath));

app.get("*", (req, res) => {
  if (req.originalUrl.startsWith('/admin')) {
    return res.sendFile(path.join(adminPath, "index.html"));
  }
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
  connectDb()
})