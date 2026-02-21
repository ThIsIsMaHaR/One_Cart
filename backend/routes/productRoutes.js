import express from 'express'
// This import MUST match the export names in your productController.js exactly
import { addProduct, listProducts, removeProduct } from '../controllers/productController.js' 
import upload from '../middleware/multer.js'
import adminAuth from "../middleware/adminAuth.js"

const productRoutes = express.Router()

/**
 * @route   POST /api/product/addproduct
 * @desc    Add a new product with multiple images
 * @access  Private (Admin)
 */
productRoutes.post("/addproduct", 
    upload.fields([
        { name: "image1", maxCount: 1 },
        { name: "image2", maxCount: 1 },
        { name: "image3", maxCount: 1 },
        { name: "image4", maxCount: 1 }
    ]), 
    addProduct
)

/**
 * @route   GET /api/product/list
 * @desc    Get all products
 * @access  Public
 */
productRoutes.get("/list", listProducts)

/**
 * @route   POST /api/product/remove
 * @desc    Remove a product by ID
 * @access  Private (Admin)
 */
productRoutes.post("/remove", adminAuth, removeProduct)

export default productRoutes    