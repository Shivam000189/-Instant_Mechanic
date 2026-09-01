"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Registration endpoints (supports both /register and /signup)
router.post("/register", auth_controller_1.register);
router.post("/signup", auth_controller_1.register);
// Login endpoints (supports both /login and /signin)
router.post("/login", auth_controller_1.login);
router.post("/signin", auth_controller_1.login);
// Protected routes
router.get("/me", auth_middleware_1.authMiddleware, auth_controller_1.me);
router.post("/logout", auth_middleware_1.authMiddleware, auth_controller_1.logout);
exports.default = router;
