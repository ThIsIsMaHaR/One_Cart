import express from 'express'
import { addProduct, listProducts, removeProduct } from '../controllers/productController.js' 
import upload from '../middleware/multer.js'
import adminAuth from "../middleware/adminAuth.js"

const productRoutes = express.Router()

productRoutes.post("/addproduct", 
    upload.fields([
        { name: "image1", maxCount: 1 },
        { name: "image2", maxCount: 1 },
        { name: "image3", maxCount: 1 },
        { name: "image4", maxCount: 1 }
    ]), 
    addProduct
)

productRoutes.get("/list", listProducts)
productRoutes.post("/remove", adminAuth, removeProduct)

export default productRoutes