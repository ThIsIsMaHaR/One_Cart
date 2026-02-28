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

// 2. CORS - Allow the backend and frontend domains
app.use(cors({
    origin: ["https://e-comm-onecart.onrender.com", "https://e-comm-onecart-backend.onrender.com", "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "token", "adminToken"],
    optionsSuccessStatus: 200 
}));

app.options('*', cors());

// 3. HELMET (Loosened for Monolith deployment to ensure React loads)
app.use(helmet({
    contentSecurityPolicy: false, 
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(express.json());
app.use(cookieParser());

// 4. API ROUTES (Must come BEFORE static files)
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

// 5. SERVE FRONTEND STATIC FILES
// Ensure this path correctly points to your frontend/dist folder
const frontendDist = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDist));

// 6. CATCH-ALL ROUTE (For React Router support)
app.get('*', (req, res) => {
    // If it's an API call that doesn't exist, return 404 instead of HTML
    if (req.url.startsWith('/api')) {
        return res.status(404).json({ message: "API endpoint not found" });
    }
    // Serve the React index.html for all other routes
    res.sendFile(path.join(frontendDist, 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Monolith Server running on port ${port}`);
});