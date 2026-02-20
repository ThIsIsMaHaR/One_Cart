import express from 'express'
import dotenv from 'dotenv'
import connectDb from './config/db.js'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/authRoutes.js'
import cors from "cors"
import userRoutes from './routes/userRoutes.js'
import productRoutes from './routes/productRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

// Required for ES Modules to handle paths correctly
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 10000
const app = express()

// 1. Middleware
app.use(express.json())
app.use(cookieParser())

// Simple CORS for same-domain deployment
app.use(cors({
  origin: true, 
  credentials: true
}));

// 2. Health Check Route (Use this to test if server is alive)
app.get("/health", (req, res) => {
  res.send("Server is running perfectly!");
});

// 3. API Routes
app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/product", productRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/order", orderRoutes)

// 4. Serve Static Files (Frontend build)
// This goes up one level from 'backend' then into 'frontend/dist'
const frontendPath = path.resolve(__dirname, "..", "frontend", "dist");

app.use(express.static(frontendPath));

// 5. Catch-all Route
// Must be last! Serves the React app for any route that isn't an API
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"), (err) => {
    if (err) {
      console.error("Error sending index.html:", err);
      res.status(500).send("Frontend build not found at: " + frontendPath);
    }
  });
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
  connectDb()
})