import express from 'express'
import dotenv from 'dotenv'
import cors from "cors"
import cookieParser from 'cookie-parser'
import path from 'path'
import { fileURLToPath } from 'url'

// 1. Load Env variables FIRST
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

// 3. Connect to Database (This will now have access to MONGODB_URI)
connectDb();

// 4. Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// 5. Robust CORS Configuration
// This allows both your frontend, your admin, and local testing
const allowedOrigins = [
  'https://e-comm-onecart.onrender.com',
  'https://onecart-62p0.onrender.com',
  'http://localhost:5173',
  'http://localhost:5174'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('onrender.com')) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token']
}));

// Handle Preflight for all routes
app.options('*', cors());

// 6. API Routes
app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/product", productRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/order", orderRoutes)

// 7. Resolve paths for Static Assets
const adminPath = path.resolve(__dirname, "../admin/dist");
const frontendPath = path.resolve(__dirname, "../frontend/dist");

// Serve Admin static files
app.use("/admin", express.static(adminPath));

// Serve Frontend static files
app.use(express.static(frontendPath));

// 8. Handle SPA Routing (The 404 Fix)
app.get("*", (req, res) => {
  if (req.originalUrl.startsWith('/admin')) {
    res.sendFile(path.join(adminPath, "index.html"), (err) => {
      if (err) {
        console.log("Admin build not found at:", adminPath);
        res.status(404).send("Admin build not found. Run 'npm run build' in admin folder.");
      }
    });
  } else {
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