import express from 'express';
import 'dotenv/config';
import dotenv from 'dotenv';
dotenv.config();
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

// 2. CORS CONFIGURATION
// Use 'origin: true' to dynamically allow the requesting origin (very robust for production)
app.use(cors({
    origin: ["https://e-comm-onecart.onrender.com", "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization", "token", "adminToken"],
    optionsSuccessStatus: 200 
}));

// 3. MIDDLEWARES
app.use(helmet({ 
    contentSecurityPolicy: false, 
    crossOriginResourcePolicy: { policy: "cross-origin" } 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 4. API ROUTES (Must be defined BEFORE static files to avoid 404s)
app.get('/api/health', (req, res) => {
    res.status(200).json({ success: true, message: "OneCart Backend is Live!" });
});

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

// 5. STATIC FILES & MULTI-FRONTEND SERVING
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve Frontend (Main Shop)
const frontendDist = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDist));

// Serve Admin Panel (if you access it via /admin)
const adminDist = path.join(__dirname, '../admin/dist');
app.use('/admin', express.static(adminDist));

// 6. THE CATCH-ALL ROUTE (For React Router support)
app.get('*', (req, res) => {
    // If it's an API call that wasn't found, don't serve the HTML file
    if (req.url.startsWith('/api')) {
        return res.status(404).json({ success: false, message: "API endpoint not found" });
    }
    
    // Check if the request is for the admin path
    if (req.url.startsWith('/admin')) {
        return res.sendFile(path.join(adminDist, 'index.html'));
    }

    // Default to serving the main frontend
    res.sendFile(path.join(frontendDist, 'index.html'), (err) => {
        if (err) {
            res.status(500).send("Frontend build not found. Please run 'npm run build'.");
        }
    });
});

// 7. GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
    console.error("❌ SERVER ERROR:", err.message);
    res.status(err.status || 500).json({ 
        success: false, 
        message: err.message || "Internal Server Error" 
    });
});

// Listen on 0.0.0.0 for Render compatibility
app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 OneCart Server running on port ${port}`);
});