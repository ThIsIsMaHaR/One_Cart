import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';

// Route Imports
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import productRouter from './routes/productRoutes.js';
// IMPORTANT: Verify if the file is cartRoutes.js or cartRouter.js in your folder!
import cartRouter from './routes/cartRoutes.js'; 
import orderRouter from './routes/orderRoutes.js';

const app = express();
const port = process.env.PORT || 10000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Database Connection
connectDB();

// 2. Create Uploads Folder
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// 3. RELAXED CORS CONFIGURATION
const allowedOrigins = [
  "https://e-comm-onecart.onrender.com",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175"
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl) 
    // or if the origin is in our allowed list
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("CORS check failed for origin:", origin);
      // For debugging: allowing it anyway but logging it
      callback(null, true); 
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "token", "X-Requested-With", "Accept"]
}));

// 4. Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 5. API Routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

// 6. STATIC FILE SERVING
// This serves the images you've uploaded to the server
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve Admin Panel (Production)
app.use('/admin', express.static(path.join(__dirname, '../admin/dist')));
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../admin/dist', 'index.html'));
});

// Serve Frontend (Production)
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

// 7. Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error:", err.stack);
  res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
});

// 8. Start Server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});