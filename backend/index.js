import express from 'express';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import path from 'path';
import helmet from 'helmet';
import cors from 'cors';
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

// 2. ULTIMATE CORS CONFIGURATION
// This handles the "Preflight" OPTIONS request which is failing right now.
const allowedOrigins = [
    "https://e-comm-onecart.onrender.com",
    "http://localhost:5173"
];

app.use(cors({
    origin: function (origin, callback) {
        // 1. Allow requests with no origin (like Postman or mobile apps)
        if (!origin) return callback(null, true);
        
        // 2. Clean the origin string (remove trailing slashes for comparison)
        const cleanOrigin = origin.endsWith('/') ? origin.slice(0, -1) : origin;

        if (allowedOrigins.includes(cleanOrigin)) {
            callback(null, true);
        } else {
            console.error(`❌ CORS blocked for origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization", "token", "adminToken"]
}));

// 3. ESSENTIAL MIDDLEWARES
app.use(helmet({ 
    contentSecurityPolicy: false, 
    crossOriginResourcePolicy: { policy: "cross-origin" } 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 4. API ROUTES
// Health check - verify this works in your browser first!
app.get('/api/health', (req, res) => res.json({ status: "ok", message: "Backend is reachable!" }));

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

// 5. SERVING FRONTEND
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static files from the React app
const distPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(distPath));

// The Catch-All for React Router
app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});

// 6. GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
    console.error("SERVER ERROR:", err.message);
    res.status(err.status || 500).json({ 
        success: false, 
        message: err.message || "Internal Server Error" 
    });
});

app.listen(port, () => {
    console.log(`🚀 OneCart Server running on port ${port}`);
    console.log(`📡 Allowed Origins: ${allowedOrigins.join(', ')}`);
});