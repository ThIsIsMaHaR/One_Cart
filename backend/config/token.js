import jwt from "jsonwebtoken";

export const genToken = (userId) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.error("❌ JWT_SECRET IS MISSING");
        return null; // Return null instead of throwing
    }
    return jwt.sign({ id: userId }, secret, { expiresIn: "7d" });
};

export const genToken1 = (email) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.error("❌ JWT_SECRET IS MISSING");
        return null; // Return null instead of throwing
    }
    return jwt.sign({ email }, secret, { expiresIn: "7d" });
};