import jwt from 'jsonwebtoken'

const isAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies
        
        if (!token) {
            return res.status(401).json({ success: false, message: "Not Authorized, Login Again" })
        }

        // 1. Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // 2. THE FIX: Sync with your genToken key
        // We used { id: userId } in token.js, so we must use decoded.id here
        if (!decoded || !decoded.id) {
            return res.status(401).json({ success: false, message: "Invalid Token Payload" })
        }

        // 3. Attach it to the request for the controller
        req.userId = decoded.id
        
        next()

    } catch (error) {
        console.log("isAuth error:", error.message)
        return res.status(401).json({ success: false, message: "Session expired, please login again" })
    }
}

export default isAuth