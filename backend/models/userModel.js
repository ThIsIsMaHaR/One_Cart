import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true, // Good practice for engineering roles to prevent case issues
        trim: true
    },
    password: {
        type: String,
        required: false // Explicitly false for Google Login compatibility
    },
    cartData: {
        type: Object,
        default: {}
    }
}, { timestamps: true, minimize: false });

// This prevents Mongoose from creating multiple models if the server restarts (common on Render)
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;