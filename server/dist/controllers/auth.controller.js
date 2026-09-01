"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.me = exports.login = exports.register = void 0;
const auth_service_1 = require("../services/auth.service");
const jwt_1 = require("../utils/jwt");
// Register / Sign Up
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide name, email, and password",
            });
        }
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long",
            });
        }
        const user = await (0, auth_service_1.registerUser)({ name, email, password });
        const token = (0, jwt_1.generateToken)(user.id);
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            expiresIn: "24h",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                avatarUrl: user.avatarUrl,
                createdAt: user.createdAt,
            },
        });
    }
    catch (error) {
        const statusCode = error.statusCode || error.status || 500;
        return res.status(statusCode).json({
            success: false,
            message: error.message || "Failed to register user",
        });
    }
};
exports.register = register;
// Login / Sign In
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide both email and password",
            });
        }
        const user = await (0, auth_service_1.loginUser)({ email, password });
        const token = (0, jwt_1.generateToken)(user.id);
        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            expiresIn: "24h",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                avatarUrl: user.avatarUrl,
                createdAt: user.createdAt,
            },
        });
    }
    catch (error) {
        const statusCode = error.statusCode || error.status || 500;
        return res.status(statusCode).json({
            success: false,
            message: error.message || "Failed to login",
        });
    }
};
exports.login = login;
// Get current authenticated user profile
const me = async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const user = await (0, auth_service_1.getMe)(req.userId);
        return res.status(200).json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        const statusCode = error.statusCode || error.status || 500;
        return res.status(statusCode).json({
            success: false,
            message: error.message || "Failed to fetch user profile",
        });
    }
};
exports.me = me;
// Logout
const logout = async (_req, res) => {
    return res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
};
exports.logout = logout;
