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
    // We use an Array here to match the logic in your productController.js
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

// CRITICAL: We name the constant 'productModel' to match your controller's import
const productModel = mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;