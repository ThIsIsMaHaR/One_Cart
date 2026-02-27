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

// 3. SECURITY & CORS (MUST BE BEFORE ROUTES)
// Configured for Google Fonts AND Razorpay Integration
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

const allowedOrigins = [
  "https://e-comm-onecart.onrender.com",
  "http://localhost:5173",
  "http://localhost:5174"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "token", "adminToken", "Accept"]
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight for all routes

// 4. MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 5. API ROUTES
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

// 6. STATIC FILE SERVING
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve Admin Panel
app.use('/admin', express.static(path.join(__dirname, '../admin/dist')));
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../admin/dist', 'index.html'));
});

// Serve Frontend
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

// 7. GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("Global Error:", err.message);
  res.status(500).json({ 
    success: false, 
    message: "Internal Server Error", 
    error: err.message 
  });
});

// 8. START SERVER
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});