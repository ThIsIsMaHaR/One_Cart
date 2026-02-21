import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true 
    },
    // Using Array to store multiple image URLs from Cloudinary
    image: { 
        type: Array, 
        required: true 
    },
    category: { 
        type: String, 
        required: true 
    },
    subCategory: { 
        type: String, 
        required: true 
    },
    sizes: { 
        type: Array, 
        required: true 
    },
    bestseller: { 
        type: Boolean 
    },
    date: { 
        type: Number, 
        required: true 
    }
}, { timestamps: true });

// This logic prevents the "Cannot overwrite model once compiled" error on Render
const productModel = mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;