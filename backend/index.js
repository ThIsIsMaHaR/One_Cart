import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';

// Route Imports
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
// ... other imports

const app = express();
const port = process.env.PORT || 10000;

// 1. NUCLEAR CORS - MUST BE FIRST
const allowedOrigins = [
  "https://e-comm-onecart.onrender.com", // Frontend
  "http://localhost:5173"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "token", "adminToken", "Accept"]
};

// Apply CORS to all routes
app.use(cors(corsOptions));

// 2. EXPLICIT OPTIONS HANDLER - Fixes the "Missing Header" on preflight
app.options('*', cors(corsOptions));

// 3. Middlewares
app.use(express.json());
app.use(cookieParser());

// 4. Database Connection (Move after CORS to prevent startup delays blocking preflight)
connectDB();

// 5. API Routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
// ...

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});