import { Router } from "express";
import { register, login, me, logout } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// Registration endpoints (supports both /register and /signup)
router.post("/register", register);
router.post("/signup", register);

// Login endpoints (supports both /login and /signin)
router.post("/login", login);
router.post("/signin", login);

// Protected routes
router.get("/me", authMiddleware, me);
router.post("/logout", authMiddleware, logout);

export default router;
