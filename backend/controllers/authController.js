import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { genToken } from "../config/token.js";
import jwt from 'jsonwebtoken';

const cookieOptions = {
    httpOnly: true,
    secure: true,      // Required for HTTPS (Production)
    sameSite: "none",  // Required for Cross-Domain (Vercel to Render)
    maxAge: 7 * 24 * 60 * 60 * 1000 
};

// --- USER LOGIN ---
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
            message: "User Login successful", 
            user: { _id: user._id, name: user.name, email: user.email } 
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// --- ADMIN LOGIN ---
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

// --- GET ADMIN PROFILE ---
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

// --- LOGOUT (BOTH) ---
export const logOut = async (req, res) => {
    res.clearCookie("token", cookieOptions);
    res.clearCookie("adminToken", cookieOptions);
    return res.status(200).json({ success: true, message: "Logged out successfully" });
};