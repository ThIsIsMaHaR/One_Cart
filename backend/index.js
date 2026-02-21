import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';

// Import Routers - EXACT matching with your filenames
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import productRouter from './routes/productRoutes.js';
import cartRouter from './routes/cartRoutes.js';
import orderRouter from './routes/orderRoutes.js';

const app = express();
const port = process.env.PORT || 10000;

// 1. Connect to Database
connectDB();

// 2. CORS Configuration (Fixes the ERR_FAILED from earlier)
const allowedOrigins = [
  "https://e-comm-onecart.onrender.com", 
  "http://localhost:5173",               
  "http://localhost:5174"                
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS policy violation'), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// 3. Essential Middleware
app.use(express.json());
app.use(cookieParser());

// 4. Global Preflight (Fixes CORS preflight crashes)
app.options('*', cors());

// 5. API Routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

// 6. Health Check
app.get('/', (req, res) => {
  res.send("🚀 OneCart Backend is Live and Connected!");
});

// 7. Start Server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});