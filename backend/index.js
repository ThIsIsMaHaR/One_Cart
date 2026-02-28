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

// 1. Connect to Database
connectDB().catch(err => console.error("🛑 MongoDB Connection Error:", err));

// 2. CORS - Aggressive configuration for Monolith
const allowedOrigins = [
    "https://e-comm-onecart.onrender.com",
    "https://e-comm-onecart-backend.onrender.com",
    "http://localhost:5173"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1 || origin.includes('onrender.com')) {
            callback(null, true);
        } else {
            callback(new Error('CORS Policy Blocked this Origin'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "token", "adminToken"],
    optionsSuccessStatus: 200 
}));

// Manually handle the "Preflight" for all routes
app.options('*', cors());

// 3. HELMET (Disabled CSP to ensure joint deployment loads correctly)
app.use(helmet({
    contentSecurityPolicy: false, 
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(express.json());
app.use(cookieParser());

// 4. API ROUTES (Must stay ABOVE static files)
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

// 5. SERVE FRONTEND STATIC FILES
const frontendDist = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDist));

// 6. CATCH-ALL (For React Router support)
app.get('*', (req, res) => {
    if (req.url.startsWith('/api')) {
        return res.status(404).json({ message: "API endpoint not found" });
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Monolith Server running on port ${port}`);
});