import express from 'express';
import cors from 'cors';

const app = express();
// Render sets the PORT automatically
const port = process.env.PORT || 10000;

// 1. SIMPLEST CORS (Allow everything for testing)
app.use(cors());
app.use(express.json());

// 2. THE TEST ROUTE
// Once deployed, visit: https://e-comm-onecart-backend.onrender.com/api/test
app.get('/api/test', (req, res) => {
    res.status(200).json({ 
        success: true, 
        message: "The bridge is built! Backend is responding." 
    });
});

// 3. LISTEN ON 0.0.0.0 (Crucial for Render)
app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Skeleton Server running on port ${port}`);
});