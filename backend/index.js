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
// Render usually provides the PORT, otherwise default to 10000
const port = process.env.PORT || 10000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Database Connection
connectDB();

// 2. ROBUST CORS CONFIGURATION
// This allows your frontend to talk to your backend with cookies.
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            "https://e-comm-onecart.onrender.com",
            "http://localhost:5173"
        ];
        // Allow requests with no origin (like Postman) or matching origins
        if (!origin || allowedOrigins.some(allowed => origin.startsWith(allowed))) {
            callback(null, true);
        } else {
            console.error(`❌ CORS blocked for origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization", "token", "adminToken"],
    optionsSuccessStatus: 200 // Essential for preflight checks on Render
}));

// 3. MIDDLEWARES
// We adjust helmet so it doesn't block the frontend from loading images/resources
app.use(helmet({ 
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 4. API ROUTES
// Health check - Visit https://e-comm-onecart-backend.onrender.com/api/health
app.get('/api/health', (req, res) => {
    res.json({ 
        success: true, 
        message: "OneCart API is running!", 
        env: process.env.NODE_ENV 
    });
});

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

// 5. STATIC FILES & FRONTEND SERVING
// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Path to your React build (adjust if your build folder is named 'build' or 'dist')
// Since your package.json builds into frontend/dist:
const frontendDist = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDist));

// The Catch-All for React Router
// If any route is hit that isn't an API route, serve the React index.html
app.get('*', (req, res) => {
    // Only serve index.html if it's not an API call
    if (req.url.startsWith('/api')) {
        return res.status(404).json({ success: false, message: "API route not found" });
    }
    res.sendFile(path.join(frontendDist, 'index.html'), (err) => {
        if (err) {
            res.status(500).send("Frontend build not found. Please run 'npm run build'.");
        }
    });
});

// 6. GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
    console.error("❌ SERVER ERROR:", err.stack);
    res.status(err.status || 500).json({ 
        success: false, 
        message: err.message || "Internal Server Error" 
    });
});

app.listen(port, () => {
    console.log(`🚀 Server active on port ${port}`);
});