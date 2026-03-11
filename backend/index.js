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

// 2. FINAL CORS CONFIGURATION (Both Frontend & Admin Fixed)
const allowedOrigins = [
    "https://one-cart-flax.vercel.app",        // Aapka User Site (Working)
    "https://one-cart-admin-smoky.vercel.app", // Aapka Naya Admin Panel (Fixing Now)
    "http://localhost:5173",
    "http://localhost:5174"
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log("CORS Blocked for:", origin);
            callback(new Error('CORS Error: Origin not allowed'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "token", "adminToken"]
}));

// 3. MIDDLEWARES
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());
app.use(cookieParser());

// 4. API ROUTES
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 5. Root Route
app.get('/', (req, res) => res.send("🚀 OneCart API is Live and Fully Connected!"));

// 6. Start Server
app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${port}`);
});