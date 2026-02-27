import User from "../models/userModel.js"

// --- GET CURRENT USER (For Frontend Website) ---
// This relies on the authUser middleware correctly decoding the 'token' cookie
export const getCurrentUser = async (req, res) => {
    try {
        // req.userId is set by your authUser middleware after verifying the JWT
        const user = await User.findById(req.userId).select("-password");
        
        if (!user) {
           return res.status(404).json({ success: false, message: "User not found" });
        }

        // Standardized success response for the UserContext/ShopContext
        return res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                cartData: user.cartData // Include cart if your frontend needs it on load
            }
        });

    } catch (error) {
        console.error("getCurrentUser error:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Server error while fetching user profile" 
        });
    }
}

// --- GET ADMIN DATA (For Admin Panel) ---
// This relies on the adminAuth middleware correctly decoding the 'adminToken' cookie
export const getAdmin = async (req, res) => {
    try {
        // req.adminEmail is set by your adminAuth middleware
        const adminEmail = req.adminEmail;
        
        if (!adminEmail) {
            return res.status(401).json({ success: false, message: "Admin session expired or invalid" });
        }

        // Standardized success response for the Admin panel logic
        return res.status(200).json({
            success: true,
            adminData: {
                email: adminEmail,
                role: "admin"
            }
        });

    } catch (error) {
        console.error("getAdmin error:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Server error while fetching admin profile" 
        });
    }
}