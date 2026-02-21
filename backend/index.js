import express from 'express'
import dotenv from 'dotenv'
import connectDb from './config/db.js'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/authRoutes.js'
import cors from "cors"
import userRoutes from './routes/userRoutes.js'
import productRoutes from './routes/productRoute.js' // Ensure this matches your filename exactly
import cartRoutes from './routes/cartRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import path from 'path'
import { fileURLToPath } from 'url'

// --- CONFIGURATION ---
dotenv.config()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 10000
const app = express()

// --- 1. MIDDLEWARE SETUP ---
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// --- 2. CORS SETUP ---
// Using an array for multiple origins. Avoid trailing slashes.
const allowedOrigins = [
  'https://e-comm-onecart.onrender.com',
  'https://onecart-62p0.onrender.com'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Handle Pre-flight options
app.options('*', cors());

// --- 3. API ROUTES ---
app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/product", productRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/order", orderRoutes)

// --- 4. STATIC FILES (DEPLOYMENT) ---
// Note: path.resolve correctly targets the dist folders from the backend folder
const adminPath = path.resolve(__dirname, "..", "admin", "dist");
app.use("/admin", express.static(adminPath));

const frontendPath = path.resolve(__dirname, "..", "frontend", "dist");
app.use(express.static(frontendPath));

// Catch-all route to serve the Single Page Application (SPA)
app.get("*", (req, res) => {
  if (req.originalUrl.startsWith('/admin')) {
    return res.sendFile(path.join(adminPath, "index.html"));
  }
  res.sendFile(path.join(frontendPath, "index.html"));
});

// --- 5. SERVER START ---
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
  connectDb()
})