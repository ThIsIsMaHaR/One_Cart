import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: Array, required: true }, // Logic matches controller imagesUrl array
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    sizes: { type: Array, required: true },
    bestseller: { type: Boolean },
    date: { type: Number, required: true }
}, { timestamps: true });

// Ensures the model is only created once to prevent Render restart crashes
const productModel = mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;