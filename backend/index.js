import express from 'express';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import path from 'path';
import helmet from 'helmet';
import cors from 'cors'; // Ensure you've run: npm install cors
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

// 2. ROBUST CORS CONFIGURATION
const allowedOrigins = [
    "https://e-comm-onecart.onrender.com",
    "https://e-comm-onecart.onrender.com/", // With trailing slash
    "http://localhost:5173"
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, Postman, or server-to-server)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.error(`CORS blocked for origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization", "token", "adminToken"]
}));

// 3. ESSENTIAL MIDDLEWARES
app.use(helmet({ 
    contentSecurityPolicy: false, // Allows React to run without CSP blocks
    crossOriginResourcePolicy: { policy: "cross-origin" } // Allows images to load across domains
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 4. API ROUTES (Must be above static serving)
app.get('/api/health', (req, res) => res.json({ status: "ok", message: "OneCart Backend is alive!" }));

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

// 5. STATIC FILES & FRONTEND SERVING
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve the production build of the React app
const distPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(distPath));

// The Catch-All for React Router (MUST be the last route)
app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'), (err) => {
        if (err) {
            // If the frontend isn't built yet, don't crash the server
            res.status(500).send("Frontend build not found. Run 'npm run build' in the frontend folder.");
        }
    });
});

// 6. GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
    console.error("❌ SERVER ERROR:", err.message);
    res.status(err.status || 500).json({ 
        success: false, 
        message: err.message || "Internal Server Error" 
    });
});

app.listen(port, () => {
    console.log(`🚀 OneCart Server running on port ${port}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});