import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 10000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. DYNAMIC CORS
app.use(cors({
    origin: ["https://e-comm-onecart.onrender.com", "http://localhost:5173"],
    credentials: true
}));

// 2. FIXED HELMET (Allows Google Fonts & Styles)
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            "default-src": ["'self'"],
            "script-src": ["'self'", "'unsafe-inline'"],
            "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            "font-src": ["'self'", "https://fonts.gstatic.com"],
            "img-src": ["'self'", "data:", "https://res.cloudinary.com"], // Add Cloudinary if you use it
            "connect-src": ["'self'", "https://e-comm-onecart-backend.onrender.com"]
        },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(express.json());

// 3. THE TEST ROUTE
app.get('/api/test', (req, res) => {
    res.status(200).json({ success: true, message: "Bridge is open and Fonts are allowed!" });
});

// 4. SERVE FRONTEND
const distPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Server active on port ${port}`);
});