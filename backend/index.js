import express from 'express';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import cors from 'cors'; 
import connectDB from './config/db.js';

// Route Imports (Sahi paths ensure karein)
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import productRouter from './routes/productRoutes.js';
import cartRouter from './routes/cartRoutes.js'; 
import orderRouter from './routes/orderRoutes.js';

const app = express();
const port = process.env.PORT || 10000;

connectDB();

// 🛠️ FINAL ALLOWED ORIGINS (Aapke real links)
const allowedOrigins = [
    "https://one-cart-flax.vercel.app",        
    "https://one-cart-admin-smoky.vercel.app", 
    "http://localhost:5173",
    "http://localhost:5174"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('CORS Error: Origin not allowed'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "token", "adminToken"]
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

app.get('/', (req, res) => res.send("🚀 OneCart API Live!"));

app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${port}`);
});