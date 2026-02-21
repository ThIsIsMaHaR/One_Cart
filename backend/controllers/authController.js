import User from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import { genToken, genToken1 } from "../config/token.js";

// Helper for production-ready cookie settings
const cookieOptions = {
    httpOnly: true,
    secure: true,      // Essential for Render (HTTPS)
    sameSite: "none",  // Essential for Cross-Site requests on Render
    maxAge: 7 * 24 * 60 * 60 * 1000
};

// --- USER REGISTRATION ---
export const registration = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existUser = await User.findOne({ email });
        
        if (existUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Enter a valid Email" });
        }
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Enter a stronger password (min 8 chars)" });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashPassword });
        const token = await genToken(user._id);

        res.cookie("token", token, cookieOptions);
        
        // Return success flag and user data (excluding password)
        return res.status(201).json({ 
            success: true, 
            user: { _id: user._id, name: user.name, email: user.email } 
        });
    } catch (error) {
        console.error("Registration Error:", error);
        return res.status(500).json({ success: false, message: `Registration error: ${error.message}` });
    }
};

// --- USER LOGIN ---
export const login = async (req, res) => {
    try {
        let { email, password } = req.body;
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Incorrect password" });
        }

        let token = await genToken(user._id);
        res.cookie("token", token, cookieOptions);

        return res.status(200).json({ 
            success: true, 
            user: { _id: user._id, name: user.name, email: user.email } 
        });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ success: false, message: `Login error: ${error.message}` });
    }
};

// --- LOGOUT ---
export const logOut = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });
        return res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout Error:", error);
        return res.status(500).json({ success: false, message: `Logout error: ${error.message}` });
    }
};

// --- GOOGLE LOGIN ---
export const googleLogin = async (req, res) => {
    try {
        let { name, email } = req.body;
        let user = await User.findOne({ email });
        
        if (!user) {
            user = await User.create({ name, email });
        }

        let token = await genToken(user._id);
        res.cookie("token", token, cookieOptions);

        return res.status(200).json({ success: true, user });
    } catch (error) {
        console.error("Google Login Error:", error);
        return res.status(500).json({ success: false, message: `Google login error: ${error.message}` });
    }
};

// --- ADMIN LOGIN ---
export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validates against Render Environment Variables
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            
            // Uses genToken1 for Admin (usually signs with email instead of ID)
            const token = await genToken1(email);

            res.cookie("token", token, {
                ...cookieOptions,
                maxAge: 1 * 24 * 60 * 60 * 1000 // Admin session: 1 day
            });

            return res.status(200).json({ 
                success: true, 
                message: "Admin Login Successful",
                adminData: { email, role: 'admin' } 
            });
        }

        return res.status(401).json({ success: false, message: "Invalid Admin Credentials" });

    } catch (error) {
        console.error("Admin Login Error:", error);
        return res.status(500).json({ success: false, message: `Admin Login error: ${error.message}` });
    }
};