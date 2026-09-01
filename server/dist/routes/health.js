"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../config/prisma"));
const router = (0, express_1.Router)();
router.get("/", async (_req, res) => {
    let dbStatus = "disconnected";
    let dbError = null;
    try {
        // Perform a lightweight query to test PostgreSQL connection
        await prisma_1.default.$queryRaw `SELECT 1`;
        dbStatus = "connected";
    }
    catch (error) {
        dbStatus = "error";
        dbError = error.message || "Failed to connect to database";
    }
    res.status(dbStatus === "connected" ? 200 : 503).json({
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: {
            provider: "postgresql",
            status: dbStatus,
            ...(dbError && { error: dbError }),
        },
    });
});
exports.default = router;
