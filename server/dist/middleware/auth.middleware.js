"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jwt_1 = require("../utils/jwt");
const prisma_1 = __importDefault(require("../config/prisma"));
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Missing or invalid authorization header",
            });
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Token not provided",
            });
        }
        let decoded;
        try {
            decoded = (0, jwt_1.verifyToken)(token);
        }
        catch (err) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Invalid or expired token",
            });
        }
        if (!decoded?.userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Malformed token payload",
            });
        }
        const user = await prisma_1.default.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                email: true,
                name: true,
                avatarUrl: true,
            },
        });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User not found",
            });
        }
        req.userId = user.id;
        req.user = user;
        next();
    }
    catch (error) {
        console.error("Auth middleware error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error during authentication",
        });
    }
};
exports.authMiddleware = authMiddleware;
