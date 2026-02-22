import jwt from 'jsonwebtoken'

const adminAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({ success: false, message: "Not Authorized, Login Again" });
        }

        // 1. Verify the token using the secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 2. THE CRITICAL CHECK:
        // Ensure the email inside the token matches your ADMIN_EMAIL
        // We use .email because that's what we set in genToken1
        if (decoded.email !== process.env.ADMIN_EMAIL) {
            return res.status(403).json({ success: false, message: "Not Authorized: Access Denied" });
        }

        // 3. Attach email to request for use in later routes if needed
        req.adminEmail = decoded.email;

        next();
        
    } catch (error) {
        console.log("adminAuth error:", error.message);
        return res.status(401).json({ success: false, message: "Session expired or invalid token" });
    }
}

export default adminAuth;