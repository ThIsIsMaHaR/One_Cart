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

// 3. Connect to Database 
connectDb();

// 4. Robust CORS Configuration
const allowedOrigins = [
  'https://e-comm-onecart.onrender.com',
  'https://onecart-62p0.onrender.com',
  'http://localhost:5173',
  'http://localhost:5174'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman or mobile apps)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('onrender.com')) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token', 'Accept']
}));

// 5. MANUAL PREFLIGHT HANDLER (The Fix for "No Access-Control-Allow-Origin")
// This explicitly answers the browser's "OPTIONS" request with a 200 OK status.
app.options('*', (req, res) => {
  const origin = req.header('Origin');
  if (allowedOrigins.includes(origin) || (origin && origin.includes('onrender.com'))) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, token, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  return res.sendStatus(200);
});



// 6. Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// 7. API Routes
app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/product", productRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/order", orderRoutes)

// 8. Static File Handling
const adminPath = path.resolve(__dirname, "../admin/dist");
const frontendPath = path.resolve(__dirname, "../frontend/dist");

app.use("/admin", express.static(adminPath));
app.use(express.static(frontendPath));

// 9. SPA Routing (The 404 Refresh Fix)
app.get("*", (req, res) => {
  if (req.originalUrl.startsWith('/admin')) {
    res.sendFile(path.join(adminPath, "index.html"), (err) => {
      if (err) res.status(404).send("Admin build not found.");
    });
  } else {
    res.sendFile(path.join(frontendPath, "index.html"), (err) => {
      if (err) res.status(404).send("Frontend build not found.");
    });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`)
})