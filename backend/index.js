import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js'; // Ensure this path matches your file
import authRouter from './routes/authRoute.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';

const app = express();
const port = process.env.PORT || 10000;

// 1. Connect to Database
connectDB();

// 2. CORS Configuration (The fix for your ERR_FAILED)
const allowedOrigins = [
  "https://e-comm-onecart.onrender.com", // Your Render Frontend/Admin
  "http://localhost:5173",               // Local Vite Frontend
  "http://localhost:5174"                // Local Vite Admin
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman or mobile)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true, // Crucial for cookies/sessions
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// 3. Essential Middleware
app.use(express.json());
app.use(cookieParser());

// 4. Handle Preflight Requests globally
app.options('*', cors());

// 5. API Routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);

// 6. Health Check & Root Route
app.get('/', (req, res) => {
  res.send("🚀 OneCart Backend is Running Perfectly!");
});

// 7. Start Server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  if (!process.env.MONGODB_URI) {
    console.error("❌ ERROR: MONGODB_URI is missing in Environment Variables!");
  }
});