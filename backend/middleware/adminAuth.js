import jwt from 'jsonwebtoken'

const adminAuth = async (req, res, next) => {
    try {
        // IMPORTANT: Admin uses "adminToken"
        const { adminToken } = req.cookies;

        if (!adminToken) {
            return res.status(401).json({ success: false, message: "Not Authorized, Login Again" });
        }

        // Check if environment variables are set (Prevents server-side mystery crashes)
        if (!process.env.JWT_SECRET || !process.env.ADMIN_EMAIL) {
            console.error("CRITICAL: JWT_SECRET or ADMIN_EMAIL missing in environment variables.");
            return res.status(500).json({ success: false, message: "Server Configuration Error" });
        }

        // 1. Verify the admin token
        const decoded = jwt.verify(adminToken, process.env.JWT_SECRET);

        // 2. Check if the email inside matches your secret admin email
        if (decoded.email !== process.env.ADMIN_EMAIL) {
            return res.status(403).json({ success: false, message: "Access Denied: Not an Admin" });
        }

        // 3. Attach email to the request object for use in userController.getAdmin
        req.adminEmail = decoded.email;

        next();
        
    } catch (error) {
        console.log("adminAuth error:", error.message);
        return res.status(401).json({ success: false, message: "Session expired or invalid token" });
    }
}

export default adminAuth;