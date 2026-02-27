import User from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import { genToken } from "../config/token.js";
import jwt from 'jsonwebtoken';

const cookieOptions = {
    httpOnly: true,
    secure: true, 
    sameSite: "none", 
    maxAge: 7 * 24 * 60 * 60 * 1000 
};

export const registration = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existUser = await User.findOne({ email });
        if (existUser) return res.status(400).json({ success: false, message: "User already exists" });
        if (!validator.isEmail(email)) return res.status(400).json({ success: false, message: "Enter a valid Email" });
        if (password.length < 8) return res.status(400).json({ success: false, message: "Min 8 characters required" });

        const hashPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashPassword });
        
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is missing!");
            return res.status(500).json({ success: false, message: "Server configuration error" });
        }

        const token = genToken(user._id);
        res.cookie("token", token, cookieOptions);
        return res.status(201).json({ success: true, user: { _id: user._id, name: user.name, email: user.email } });
    } catch (error) {
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
        return res.status(200).json({ success: true, user: { _id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const logOut = async (req, res) => {
    res.clearCookie("token", cookieOptions);
    res.clearCookie("adminToken", cookieOptions);
    return res.status(200).json({ success: true, message: "Logged out" });
};

export const googleLogin = async (req, res) => {
    try {
        const { name, email } = req.body;
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({ name, email, password: await bcrypt.hash(Math.random().toString(), 10) });
        }
        const token = genToken(user._id);
        res.cookie("token", token, cookieOptions);
        return res.status(200).json({ success: true, user });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ email }, process.env.JWT_SECRET);
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