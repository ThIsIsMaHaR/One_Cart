import User from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import { genToken } from "../config/token.js";
import jwt from 'jsonwebtoken';

// IMPROVEMENT: Dynamic Cookie Options
// secure: true and sameSite: "none" are REQUIRED for Render (HTTPS) 
// but will BREAK on Localhost (HTTP).
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Only true in production
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", 
    maxAge: 7 * 24 * 60 * 60 * 1000 
};

export const registration = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // 1. Validation
        const existUser = await User.findOne({ email });
        if (existUser) return res.status(400).json({ success: false, message: "User already exists" });
        if (!validator.isEmail(email)) return res.status(400).json({ success: false, message: "Enter a valid Email" });
        if (password.length < 8) return res.status(400).json({ success: false, message: "Min 8 characters required" });

        // 2. Hashing
        const hashPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashPassword });
        
        // 3. Token & Cookie
        if (!process.env.JWT_SECRET) {
            console.error("❌ JWT_SECRET is missing in .env!");
            return res.status(500).json({ success: false, message: "Server configuration error" });
        }

        const token = genToken(user._id);
        res.cookie("token", token, cookieOptions);

        // IMPROVEMENT: Don't send password back in the response
        return res.status(201).json({ 
            success: true, 
            message: "Account created successfully",
            user: { _id: user._id, name: user.name, email: user.email } 
        });
    } catch (error) {
        console.error("Registration Error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ success: false, message: "Incorrect password" });

        const token = genToken(user._id);
        res.cookie("token", token, cookieOptions);

        return res.status(200).json({ 
            success: true, 
            message: "Login successful",
            user: { _id: user._id, name: user.name, email: user.email } 
        });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const logOut = async (req, res) => {
    // Note: To clear a cookie, the options (except maxAge/expires) must match the ones used to set it.
    res.clearCookie("token", cookieOptions);
    res.clearCookie("adminToken", cookieOptions);
    return res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const googleLogin = async (req, res) => {
    try {
        const { name, email } = req.body;
        let user = await User.findOne({ email });

        if (!user) {
            // Generate a random password for social logins
            const tempPassword = Math.random().toString(36).slice(-10);
            const hashedPassword = await bcrypt.hash(tempPassword, 10);
            user = await User.create({ name, email, password: hashedPassword });
        }

        const token = genToken(user._id);
        res.cookie("token", token, cookieOptions);

        // IMPROVEMENT: Filtered user data
        return res.status(200).json({ 
            success: true, 
            user: { _id: user._id, name: user.name, email: user.email } 
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Ensure these variables exist in your .env
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' });
            res.cookie("adminToken", token, cookieOptions);
            return res.status(200).json({ success: true, message: "Admin Login Successful" });
        }
        
        return res.status(401).json({ success: false, message: "Invalid Admin Credentials" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getAdmin = async (req, res) => {
    try {
        const token = req.cookies.adminToken;
        if (!token) return res.status(401).json({ success: false, message: "Unauthorized" });
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return res.status(200).json({ success: true, adminData: { email: decoded.email } });
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid session" });
    }
};