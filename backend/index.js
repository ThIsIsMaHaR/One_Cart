import express from 'express';
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

// 1. Database Connection
connectDB();

// 2. MANUAL CORS HANDLER (MUST BE FIRST)
app.use((req, res, next) => {
    const origin = req.headers.origin;
    const allowedOrigins = [
        "https://e-comm-onecart.onrender.com",
        "http://localhost:5173"
    ];

    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
    }
    
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, token, adminToken");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }
    next();
});

// 3. ESSENTIAL MIDDLEWARES
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 4. API ROUTES (MUST BE ABOVE STATIC SERVING)
// Health check route - use this to verify the backend is alive
app.get('/api/health', (req, res) => res.json({ status: "ok", message: "Backend is reachable!" }));

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

// 5. SERVING FRONTEND (MUST BE AFTER API ROUTES)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// The Catch-All for React Router - THIS MUST BE LAST
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

// 6. GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
    console.error("SERVER ERROR:", err.stack);
    res.status(500).json({ success: false, message: "Internal Server Error" });
});

app.listen(port, () => console.log(`🚀 Server running on port ${port}`));