import { v2 as cloudinary } from 'cloudinary';
import productModel from '../models/productModel.js';
import fs from 'fs';

// --- ADD PRODUCT ---
export const addProduct = async (req, res) => {
    try {
        // ENSURE CLOUDINARY IS CONFIGURED INSIDE THE HANDLER OR RE-VERIFIED
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });

        const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

        // 1. Extract images safely
        const image1 = req.files?.image1?.[0];
        const image2 = req.files?.image2?.[0];
        const image3 = req.files?.image3?.[0];
        const image4 = req.files?.image4?.[0];

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

        // 2. Upload images to Cloudinary
        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                
                // IMPORTANT: Delete local temp file after upload to save space on Render
                if (fs.existsSync(item.path)) {
                    fs.unlinkSync(item.path);
                }
                return result.secure_url;
            })
        );

        // 3. Prepare Product Data with robust parsing
        const productData = {
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestseller: bestseller === "true" || bestseller === true,
            // Robust parsing: handles undefined, strings, or already parsed arrays
            sizes: sizes ? (typeof sizes === 'string' ? JSON.parse(sizes) : sizes) : [],
            image: imagesUrl,
            date: Date.now()
        };

        // 4. Save to MongoDB
        const product = new productModel(productData);
        await product.save();

        return res.status(201).json({ success: true, message: "Product Added Successfully" });

    } catch (error) {
        console.error("Add Product Error:", error);
        // If an error happens, try to clean up any temp files left behind
        return res.status(500).json({ success: false, message: error.message });
    }
};

// --- LIST ALL PRODUCTS ---
export const listProducts = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.status(200).json({ success: true, products });
    } catch (error) {
        console.error("List Products Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- REMOVE PRODUCT ---
export const removeProduct = async (req, res) => {
    try {
        const { id } = req.body;
        const deletedProduct = await productModel.findByIdAndDelete(id);
        
        if (!deletedProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({ success: true, message: "Product Removed Successfully" });
    } catch (error) {
        console.error("Remove Product Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};