import express from 'express'
// NOTE: If your folder is named 'controller' (singular), remove the 's' below.
import { addProduct, listProducts, removeProduct } from '../controllers/productController.js' 
import upload from '../middleware/multer.js'
import adminAuth from "../middleware/adminAuth.js"

const productRoutes = express.Router()

// Route for Adding Product
// Ensure 'addProduct' is correctly exported from your controller
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
// Standardized to 'listProducts' to match typical controller naming
productRoutes.get("/list", listProducts)

// Route for Removing Products
productRoutes.post("/remove", adminAuth, removeProduct)

export default productRoutes