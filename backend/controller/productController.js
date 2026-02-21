import uploadOnCloudinary from "../config/cloudinary.js"
import Product from "../model/productModel.js"

export const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

        // Safely extract images (prevents crash if an image is missing)
        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

        // Upload images to Cloudinary and get URLs
        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await uploadOnCloudinary(item.path);
                return result; // Assuming this returns the secure_url string
            })
        );

        const productData = {
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestseller: bestseller === "true" ? true : false,
            sizes: JSON.parse(sizes),
            // We save the array of URLs. If you prefer image1, image2, etc., 
            // you can use imagesUrl[0], imagesUrl[1] etc.
            image: imagesUrl, 
            date: Date.now(),
        };

        const product = new Product(productData);
        await product.save();

        res.status(201).json({ success: true, message: "Product Added Successfully", product });

    } catch (error) {
        console.log("AddProduct Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const listProduct = async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json({ success: true, products });
    } catch (error) {
        console.log("ListProduct Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const removeProduct = async (req, res) => {
    try {
        // Changed to use body for consistency with some admin panels, 
        // but if your frontend sends it in the URL, keep it as req.params.id
        const id = req.body.id || req.params.id; 
        await Product.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Product Removed" });
    } catch (error) {
        console.log("RemoveProduct Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};