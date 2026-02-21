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

// Connect to Database
connectDb();

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Updated CORS: Allow all origins for now to fix 500/Blocked errors
app.use(cors({
  origin: true, 
  credentials: true
}));

app.options('*', cors());

// API Routes
app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/product", productRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/order", orderRoutes)

// --- STATIC FILES CONFIGURATION ---

// 1. Resolve paths carefully
const adminPath = path.join(__dirname, "../admin/dist");
const frontendPath = path.join(__dirname, "../frontend/dist");

// 2. Debug logs (Check these in Render Logs to see if paths are correct)
console.log("Admin Dist Path:", adminPath);
console.log("Frontend Dist Path:", frontendPath);

// 3. Serve Admin static files
app.use("/admin", express.static(adminPath));

// 4. Serve Frontend static files
app.use(express.static(frontendPath));

// 5. Handle SPA Routing (The 404 Fix)
app.get("*", (req, res) => {
  // If request starts with /admin, serve admin/index.html
  if (req.originalUrl.startsWith('/admin')) {
    res.sendFile(path.join(adminPath, "index.html"), (err) => {
      if (err) res.status(404).send("Admin Build folder not found. Did you run 'npm run build' in the admin folder?");
    });
  } else {
    // Everything else serves the main frontend
    res.sendFile(path.join(frontendPath, "index.html"), (err) => {
      if (err) res.status(404).send("Frontend Build folder not found.");
    });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`)
})