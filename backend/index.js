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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 10000
const app = express()

app.use(express.json())
app.use(cookieParser())

app.use(cors({
  origin: true, 
  credentials: true
}));

// API Routes
app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/product", productRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/order", orderRoutes)

// Serve Static Files
const frontendPath = path.resolve(__dirname, "..", "frontend", "dist");

// DEBUG LOG: This will show up in your Render logs to help us
console.log("Looking for frontend at:", frontendPath);

app.use(express.static(frontendPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"), (err) => {
    if (err) {
      res.status(500).send("Frontend build not found. Path checked: " + frontendPath);
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
  connectDb()
})