import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import helmet from 'helmet';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';

// Route Imports
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import productRouter from './routes/productRoutes.js';
import cartRouter from './routes/cartRoutes.js'; 
import orderRouter from './routes/orderRoutes.js';

const app = express();
const port = process.env.PORT || 10000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. DATABASE CONNECTION
connectDB();

// 2. CREATE UPLOADS FOLDER
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// 3. MANUAL CORS & PREFLIGHT HANDLER (CRITICAL: MUST BE FIRST)
// This satisfies the browser BEFORE any other middleware like Helmet or Auth
app.use((req, res, next) => {
    const allowedOrigins = [
        "https://e-comm-onecart.onrender.com", 
        "http://localhost:5173", 
        "http://localhost:5174"
    ];
    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
    }
    
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, token, adminToken");

    // Handle Preflight security check
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }
    next();
});

// 4. SECURITY (HELMET) - Configured for Google Fonts & Razorpay
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://checkout.razorpay.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:", "https://web-static.razorpay.com"],
        connectSrc: [
            "'self'", 
            "https://e-comm-onecart-backend.onrender.com", 
            "https://e-comm-onecart.onrender.com",
            "https://lumberjack-cx.razorpay.com"
        ],
        frameSrc: ["'self'", "https://api.razorpay.com", "https://tds.razorpay.com"],
      },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" } 
  })
);

// 5. MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 6. API ROUTES
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

// 7. STATIC FILE SERVING
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve Admin Panel
app.use('/admin', express.static(path.join(__dirname, '../admin/dist')));
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../admin/dist', 'index.html'));
});

// Serve Frontend (Main Site)
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

// 8. GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("Global Error Logged:", err.message);
  res.status(500).json({ 
    success: false, 
    message: "Internal Server Error", 
    error: err.message 
  });
});

// 9. START SERVER
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});