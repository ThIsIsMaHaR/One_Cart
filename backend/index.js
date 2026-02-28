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

// 1. Connect Database
connectDB();

// 2. CORS - Must be at the very top
app.use(cors({
    origin: ["https://e-comm-onecart.onrender.com", "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "token", "adminToken"],
    optionsSuccessStatus: 200
}));

// 3. Middlewares
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 4. API ROUTES - Define these BEFORE serving static files
app.get('/api/health', (req, res) => {
    return res.status(200).json({ success: true, message: "API is working!" });
});

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

// 5. STATIC FILES
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Pointing to your frontend build folder
const frontendDist = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDist));

// 6. CATCH-ALL ROUTE
// This must be the absolute last route in the file
app.get('*', (req, res) => {
    // Prevent the frontend from trying to handle failed API calls
    if (req.url.startsWith('/api')) {
        return res.status(404).json({ success: false, message: "API endpoint not found" });
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
});

app.listen(port, () => {
    console.log(`🚀 Server active on port ${port}`);
});