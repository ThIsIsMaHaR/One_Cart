import User from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import { genToken, genToken1 } from "../config/token.js";
import jwt from 'jsonwebtoken';

// Standardized cookie settings
// secure: true is ONLY for production (HTTPS). On localhost (HTTP), it must be false.
const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
    httpOnly: true,
    secure: isProduction, // Dynamically sets based on environment
    sameSite: isProduction ? "none" : "lax", // "none" requires secure: true
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

// --- USER REGISTRATION ---
export const registration = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // 1. Validations
        const existUser = await User.findOne({ email });
        if (existUser) return res.status(400).json({ success: false, message: "User already exists" });
        if (!validator.isEmail(email)) return res.status(400).json({ success: false, message: "Enter a valid Email" });
        if (password.length < 8) return res.status(400).json({ success: false, message: "Min 8 characters required" });

        // 2. Hashing Password
        const hashPassword = await bcrypt.hash(password, 10);
        
        // 3. Create User
        const user = await User.create({ name, email, password: hashPassword });
        
        // 4. Token Generation (Ensure JWT_SECRET is set in Render Env)
        const token = genToken(user._id);

        res.cookie("token", token, cookieOptions);
        return res.status(201).json({ 
            success: true, 
            user: { _id: user._id, name: user.name, email: user.email } 
        });
    } catch (error) {
        console.error("Registration Error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// --- USER LOGIN ---
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        // Compare password with hashed password in DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ success: false, message: "Incorrect password" });

        const token = genToken(user._id);
        res.cookie("token", token, cookieOptions);

        return res.status(200).json({ 
            success: true, 
            user: { _id: user._id, name: user.name, email: user.email } 
        });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// --- LOGOUT ---
export const logOut = async (req, res) => {
    try {
        const clearOptions = {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
        };

        res.clearCookie("token", clearOptions);
        res.clearCookie("adminToken", clearOptions);

        return res.status(200).json({ 
            success: true, 
            message: "Logged out successfully" 
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Logout error" });
    }
};

// --- GOOGLE LOGIN ---
export const googleLogin = async (req, res) => {
    try {
        const { name, email } = req.body;
        let user = await User.findOne({ email });
        if (!user) {
            // Note: Google users might need a placeholder password if your model requires one
            user = await User.create({ name, email, password: await bcrypt.hash(Date.now().toString(), 10) });
        }
        const token = genToken(user._id);
        res.cookie("token", token, cookieOptions);
        return res.status(200).json({ success: true, user });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// --- ADMIN LOGIN ---
export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Ensure ADMIN_EMAIL and ADMIN_PASSWORD are set in Render Environment
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = genToken1(email); 

            res.cookie("adminToken", token, {
                ...cookieOptions,
                maxAge: 1 * 24 * 60 * 60 * 1000 // 1 day
            });

            return res.status(200).json({ 
                success: true, 
                message: "Admin Login Successful",
                adminData: { email, role: 'admin' } 
            });
        }
        return res.status(401).json({ success: false, message: "Invalid Admin Credentials" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// --- GET ADMIN DATA ---
export const getAdmin = async (req, res) => {
    try {
        const token = req.cookies.adminToken;
        if (!token) return res.status(401).json({ success: false, message: "Unauthorized" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.email === process.env.ADMIN_EMAIL) {
            return res.status(200).json({ 
                success: true, 
                adminData: { email: process.env.ADMIN_EMAIL, role: 'admin' } 
            });
        }
        return res.status(403).json({ success: false, message: "Forbidden" });
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid session" });
    }
};