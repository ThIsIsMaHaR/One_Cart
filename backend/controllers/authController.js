import User from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import { genToken, genToken1 } from "../config/token.js";
import jwt from 'jsonwebtoken';

// Standardized cookie settings for Render Production
const cookieOptions = {
    httpOnly: true,
    secure: true,      // Required for HTTPS on Render
    sameSite: "none",  // Required for cross-site cookies
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

// --- USER REGISTRATION ---
export const registration = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existUser = await User.findOne({ email });
        
        if (existUser) return res.status(400).json({ success: false, message: "User already exists" });
        if (!validator.isEmail(email)) return res.status(400).json({ success: false, message: "Enter a valid Email" });
        if (password.length < 8) return res.status(400).json({ success: false, message: "Enter a stronger password" });

        const hashPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashPassword });
        const token = genToken(user._id);

        res.cookie("token", token, cookieOptions);
        return res.status(201).json({ 
            success: true, 
            user: { _id: user._id, name: user.name, email: user.email } 
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// --- USER LOGIN ---
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
            user: { _id: user._id, name: user.name, email: user.email } 
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// --- LOGOUT ---
export const logOut = async (req, res) => {
    try {
        res.clearCookie("token", { ...cookieOptions, maxAge: 0 });
        return res.status(200).json({ success: true, message: "Logged out successfully" });
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
            user = await User.create({ name, email });
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

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = genToken1(email); // Creates token with { email } key

            res.cookie("token", token, {
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

// --- GET ADMIN DATA (Session Persistence Fix) ---
export const getAdmin = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized: No token" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // SYNC FIX: Using decoded.email to match the key from genToken1
        if (decoded.email === process.env.ADMIN_EMAIL) {
            return res.status(200).json({ 
                success: true, 
                adminData: { email: process.env.ADMIN_EMAIL, role: 'admin' } 
            });
        }

        return res.status(403).json({ success: false, message: "Forbidden: Not an admin" });
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid or expired session" });
    }
};