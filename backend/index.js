import express from 'express'
import dotenv from 'dotenv'
import cors from "cors"
import cookieParser from 'cookie-parser'
import path from 'path'
import { fileURLToPath } from 'url'

// 1. Load Env variables FIRST before anything else
dotenv.config()

// 2. Import DB and Routes
import connectDb from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import productRoutes from './routes/productRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import orderRoutes from './routes/orderRoutes.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 10000
const app = express()

// 3. Connect to Database 
connectDb();

// 4. CRITICAL: Nuclear CORS Configuration
// This must be placed BEFORE your routes to handle preflight (OPTIONS) requests
app.use(cors({
  origin: function (origin, callback) {
    // Allows all origins (localhost and Render) to fix the "Blocked by CORS" error
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token', 'Accept']
}));

// Handle Preflight for all routes
app.options('*', cors());

// 5. General Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// 6. API Routes
app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/product", productRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/order", orderRoutes)

// 7. Resolve paths for Static Assets (Frontend and Admin)
const adminPath = path.resolve(__dirname, "../admin/dist");
const frontendPath = path.resolve(__dirname, "../frontend/dist");

// Serve Admin static files
app.use("/admin", express.static(adminPath));

// Serve Frontend static files
app.use(express.static(frontendPath));

// 8. Handle SPA Routing (The 404 Fix for Refreshes)
app.get("*", (req, res) => {
  // If request starts with /admin, serve admin/index.html
  if (req.originalUrl.startsWith('/admin')) {
    res.sendFile(path.join(adminPath, "index.html"), (err) => {
      if (err) {
        res.status(404).send("Admin build not found. Ensure you ran 'npm run build' in the admin folder.");
      }
    });
  } else {
    // Everything else serves the main frontend
    res.sendFile(path.join(frontendPath, "index.html"), (err) => {
      if (err) {
        res.status(404).send("Frontend build not found.");
      }
    });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`)
})