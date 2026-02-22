import express from 'express';
import { addProduct, listProducts, removeProduct } from '../controllers/productController.js';
import upload from '../middleware/multer.js';
import adminAuth from "../middleware/adminAuth.js";

const productRoutes = express.Router();

// Route: /api/product/add
// Added adminAuth to protect this route
productRoutes.post("/add", 
    adminAuth, 
    upload.fields([
        { name: "image1", maxCount: 1 },
        { name: "image2", maxCount: 1 },
        { name: "image3", maxCount: 1 },
        { name: "image4", maxCount: 1 }
    ]), 
    addProduct
);

// Route: /api/product/list
productRoutes.get("/list", listProducts);

// Route: /api/product/remove
productRoutes.post("/remove", adminAuth, removeProduct);

export default productRoutes;