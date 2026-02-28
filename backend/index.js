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

connectDB().catch(err => console.error("🛑 MongoDB Connection Error:", err));

app.use(cors({
    origin: ["https://e-comm-onecart.onrender.com", "http://localhost:5173"],
    credentials: true,
    optionsSuccessStatus: 200
}));

// UPDATED HELMET FOR RAZORPAY
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            "default-src": ["'self'"],
            "script-src": ["'self'", "'unsafe-inline'", "https://checkout.razorpay.com"],
            "frame-src": ["'self'", "https://api.razorpay.com", "https://tds.razorpay.com"],
            "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            "font-src": ["'self'", "https://fonts.gstatic.com"],
            "img-src": ["'self'", "data:", "https://res.cloudinary.com"],
            "connect-src": ["'self'", "https://e-comm-onecart-backend.onrender.com", "https://lumberjack.razorpay.com"]
        },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(express.json());
app.use(cookieParser());

// API ROUTES
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

// STATIC FILES
const frontendDist = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDist));

app.get('*', (req, res) => {
    if (req.url.startsWith('/api')) return res.status(404).json({ message: "API not found" });
    res.sendFile(path.join(frontendDist, 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 OneCart Server running on port ${port}`);
});