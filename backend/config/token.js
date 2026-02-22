import jwt from "jsonwebtoken";

// For regular users (Registration/Login)
export const genToken = (userId) => {
    try {
        // Storing userId under the key 'id'
        return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
    } catch (error) {
        console.log("User token error:", error);
        return null;
    }
};

// For Admin (Admin Login)
export const genToken1 = (email) => {
    try {
        // Storing admin email under the key 'email'
        return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "7d" });
    } catch (error) {
        console.log("Admin token error:", error);
        return null;
    }
};