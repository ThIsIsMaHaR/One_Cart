import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: Array, required: true }, // Must be an Array to hold Cloudinary URLs
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    sizes: { type: Array, required: true }, // Must be an Array
    bestseller: { type: Boolean },
    date: { type: Number, required: true }
})

// This check prevents re-compiling the model if it already exists
const productModel = mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;