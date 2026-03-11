import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { genToken } from "../config/token.js";
import jwt from 'jsonwebtoken';

const cookieOptions = {
    httpOnly: true,
    secure: true,      // Production (HTTPS) ke liye zaroori
    sameSite: "none",  // Cross-domain (Vercel to Render) ke liye zaroori
    maxAge: 7 * 24 * 60 * 60 * 1000 
};

// --- 1. USER REGISTRATION ---
export const registration = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existUser = await User.findOne({ email });
        if (existUser) return res.status(400).json({ success: false, message: "User already exists" });
        
        const hashPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashPassword });
        
        const token = genToken(user._id);
        res.cookie("token", token, cookieOptions);

        return res.status(201).json({ success: true, message: "Account created", user: { name, email } });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// --- 2. USER LOGIN ---
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const token = genToken(user._id);
        res.cookie("token", token, cookieOptions);

        return res.status(200).json({ 
            success: true, 
            message: "Login successful", 
            user: { _id: user._id, name: user.name, email: user.email } 
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// --- 3. GOOGLE LOGIN (FIXED: Added this back) ---
export const googleLogin = async (req, res) => {
    try {
        const { name, email } = req.body;
        let user = await User.findOne({ email });

        if (!user) {
            const tempPassword = Math.random().toString(36).slice(-10);
            const hashedPassword = await bcrypt.hash(tempPassword, 10);
            user = await User.create({ name, email, password: hashedPassword });
        }

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

// --- 4. ADMIN LOGIN ---
export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' });
            res.cookie("adminToken", token, cookieOptions);
            return res.status(200).json({ 
                success: true, 
                message: "Admin Login successful", 
                adminData: { email } 
            });
        }
        return res.status(401).json({ success: false, message: "Invalid Admin Credentials" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// --- 5. GET ADMIN PROFILE ---
export const getAdmin = async (req, res) => {
    try {
        const token = req.cookies.adminToken;
        if (!token) return res.status(401).json({ success: false });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return res.status(200).json({ success: true, adminData: { email: decoded.email } });
    } catch (error) {
        return res.status(401).json({ success: false });
    }
};

// --- 6. LOGOUT ---
export const logOut = async (req, res) => {
    res.clearCookie("token", cookieOptions);
    res.clearCookie("adminToken", cookieOptions);
    return res.status(200).json({ success: true, message: "Logged out successfully" });
};