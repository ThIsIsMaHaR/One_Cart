import jwt from "jsonwebtoken";

// For regular users (Registration/Login)
export const genToken = (userId) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is missing in environment variables");
    }
    // Storing userId under the key 'id' to match your middleware
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// For Admin (Admin Login)
export const genToken1 = (email) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is missing in environment variables");
    }
    return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "7d" });
};