import User from "../models/userModel.js"

// --- GET CURRENT USER (For Frontend Website) ---
export const getCurrentUser = async (req, res) => {
    try {
        // req.userId comes from your authUser middleware
        // Using findById to get user details without the password
        let user = await User.findById(req.userId).select("-password")
        
        if (!user) {
           return res.status(404).json({ success: false, message: "User not found" }) 
        }

        // CRITICAL: Must return success: true and the user object
        return res.status(200).json({
            success: true,
            user: user
        })

    } catch (error) {
        console.log("getCurrentUser error:", error)
        return res.status(500).json({ 
            success: false, 
            message: `getCurrentUser error: ${error.message}` 
        })
    }
}

// --- GET ADMIN DATA (For Admin Panel) ---
export const getAdmin = async (req, res) => {
    try {
        // req.adminEmail comes from your adminAuth middleware
        let adminEmail = req.adminEmail;
        
        if (!adminEmail) {
            return res.status(404).json({ success: false, message: "Admin not found" }) 
        }

        // CRITICAL: Must return success: true and adminData object
        return res.status(200).json({
            success: true,
            adminData: {
                email: adminEmail,
                role: "admin"
            }
        })

    } catch (error) {
        console.log("getAdmin error:", error)
        return res.status(500).json({ 
            success: false, 
            message: `getAdmin error: ${error.message}` 
        })
    }
}