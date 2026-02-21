import express from 'express'
import { addProduct, listProduct, removeProduct } from '../controller/productController.js'
import upload from '../middleware/multer.js'
import adminAuth from "../middleware/adminAuth.js"

const productRoutes = express.Router()

// Route for Adding Product
// upload.fields matches the image1, image2, etc. keys from your Add.jsx
productRoutes.post("/addproduct", 
    upload.fields([
        { name: "image1", maxCount: 1 },
        { name: "image2", maxCount: 1 },
        { name: "image3", maxCount: 1 },
        { name: "image4", maxCount: 1 }
    ]), 
    addProduct
)

// Route for Listing Products
productRoutes.get("/list", listProduct)

// Route for Removing Products
// Added adminAuth here - ensure your frontend is sending the token in headers
productRoutes.post("/remove", adminAuth, removeProduct)

export default productRoutes