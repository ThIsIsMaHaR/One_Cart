import express from 'express';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import path from 'path';
import helmet from 'helmet';
import cors from 'cors'; // Added official cors package
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

// 2. MODERN CORS CONFIGURATION
const allowedOrigins = [
    "https://e-comm-onecart.onrender.com",
    "http://localhost:5173"
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization", "token", "adminToken"]
}));

// 3. ESSENTIAL MIDDLEWARES
app.use(helmet({ 
    contentSecurityPolicy: false, // Required to allow React to run smoothly
    crossOriginResourcePolicy: { policy: "cross-origin" } // Helps with loading images from different origins
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 4. API ROUTES
app.get('/api/health', (req, res) => res.json({ status: "ok", message: "Backend is reachable!" }));

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

// 5. STATIC FILES & SERVING FRONTEND
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve frontend dist folder
const distPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(distPath));

// The Catch-All for React Router (Must be at the very bottom)
app.get('*', (req, res) => {
    // Check if the file exists before sending to avoid infinite loops
    const indexPath = path.join(distPath, 'index.html');
    res.sendFile(indexPath);
});

// 6. GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
    console.error("❌ SERVER ERROR:", err.message);
    res.status(err.status || 500).json({ 
        success: false, 
        message: err.message || "Internal Server Error" 
    });
});

app.listen(port, () => console.log(`🚀 Server running on port ${port} in ${process.env.NODE_ENV || 'development'} mode`));