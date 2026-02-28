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

// 1. Database Connection (Non-blocking)
connectDB().catch(err => console.error("🛑 MongoDB Connection Error:", err));

// 2. CORS - Crucial for Auth to work
app.use(cors({
    origin: ["https://e-comm-onecart.onrender.com", "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "token", "adminToken"],
    optionsSuccessStatus: 200
}));

// 3. HELMET - Fixed for Google Fonts
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            "default-src": ["'self'"],
            "script-src": ["'self'", "'unsafe-inline'"],
            "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            "font-src": ["'self'", "https://fonts.gstatic.com"],
            "img-src": ["'self'", "data:", "https://res.cloudinary.com"],
            "connect-src": ["'self'", "https://e-comm-onecart-backend.onrender.com"]
        },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 4. API ROUTES
app.get('/api/health', (req, res) => res.json({ success: true, message: "API is reachable!" }));

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

// 5. STATIC FILES (Frontend)
const frontendDist = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDist));

app.get('*', (req, res) => {
    if (req.url.startsWith('/api')) return res.status(404).json({ message: "API not found" });
    res.sendFile(path.join(frontendDist, 'index.html'));
});

// 6. Listen on 0.0.0.0 for Render
app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 OneCart Server running on port ${port}`);
});