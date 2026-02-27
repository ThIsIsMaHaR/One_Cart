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

// 1. MANUAL CORS HEADERS (THE ULTIMATE FIX)
app.use((req, res, next) => {
    const origin = req.headers.origin;
    // This allows your specific frontend URL to bypass the block
    if (origin === "https://e-comm-onecart.onrender.com" || origin === "http://localhost:5173") {
        res.header("Access-Control-Allow-Origin", origin);
    }
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, token, adminToken");

    // Immediately respond to the "Preflight" test request from the browser
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }
    next();
});

// 2. HELMET (Relaxed for Razorpay)
app.use(helmet({
    contentSecurityPolicy: false, // Temporarily disable CSP to ensure it's not the cause of the block
    crossOriginResourcePolicy: { policy: "cross-origin" } 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 3. API ROUTES
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

// 4. SERVING FRONTEND
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html')));

app.listen(port, () => console.log(`🚀 Server running on port ${port}`)); 