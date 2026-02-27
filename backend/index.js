import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import path from 'path';
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

connectDB();

// 1. DYNAMIC CORS (Fixes the "No Access-Control-Allow-Origin" error)
const allowedOrigins = [
    "https://e-comm-onecart.onrender.com",
    "http://localhost:5173"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "token", "adminToken"]
}));

// 2. FIXED HELMET (Fixes the Razorpay "default-src 'self'" error)
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://checkout.razorpay.com"],
            connectSrc: ["'self'", "https://e-comm-onecart-backend.onrender.com", "https://e-comm-onecart.onrender.com", "https://lumberjack-cx.razorpay.com"],
            frameSrc: ["'self'", "https://api.razorpay.com", "https://tds.razorpay.com"],
            imgSrc: ["'self'", "data:", "https://res.cloudinary.com"], // Added for product images
        },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" } 
}));

// 3. MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 4. API ROUTES
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

// 5. STATIC & FRONTEND SERVING
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html')));

app.listen(port, () => console.log(`🚀 Server running on port ${port}`));