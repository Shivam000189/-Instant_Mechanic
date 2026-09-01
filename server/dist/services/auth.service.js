"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.loginUser = exports.registerUser = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const hash_1 = require("../utils/hash");
const registerUser = async ({ name, email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();
    // Check if user already exists
    const existingUser = await prisma_1.default.user.findUnique({
        where: { email: normalizedEmail },
    });
    if (existingUser) {
        const error = {
            statusCode: 409,
            message: "An account with this email already exists",
        };
        throw error;
    }
    // Hash password
    const hashedPassword = await (0, hash_1.hashPassword)(password);
    // Create new user
    const user = await prisma_1.default.user.create({
        data: {
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
        },
        select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return user;
};
exports.registerUser = registerUser;
const loginUser = async ({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();
    // Find user by email
    const user = await prisma_1.default.user.findUnique({
        where: { email: normalizedEmail },
    });
    if (!user) {
        const error = {
            statusCode: 404,
            message: "No account found with this email. Please sign up first.",
        };
        throw error;
    }
    // Verify password
    const isMatch = await (0, hash_1.comparePassword)(password, user.password);
    if (!isMatch) {
        const error = {
            statusCode: 401,
            message: "Invalid email or password. Please try again.",
        };
        throw error;
    }
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
};
exports.loginUser = loginUser;
const getMe = async (userId) => {
    const user = await prisma_1.default.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    if (!user) {
        const error = {
            statusCode: 404,
            message: "User not found",
        };
        throw error;
    }
    return user;
};
exports.getMe = getMe;
