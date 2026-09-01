import { Request, Response } from "express";
import { registerUser, loginUser, getMe } from "../services/auth.service";
import { generateToken } from "../utils/jwt";
import { AuthRequest } from "../middleware/auth.middleware";

// Register / Sign Up
export const register = async (req: Request, res: Response) => {
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

    const user = await registerUser({ name, email, password });
    const token = generateToken(user.id);

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
  } catch (error: any) {
    const statusCode = error.statusCode || error.status || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to register user",
    });
  }
};

// Login / Sign In
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password",
      });
    }

    const user = await loginUser({ email, password });
    const token = generateToken(user.id);

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
  } catch (error: any) {
    const statusCode = error.statusCode || error.status || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to login",
    });
  }
};

// Get current authenticated user profile
export const me = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await getMe(req.userId);

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || error.status || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to fetch user profile",
    });
  }
};

// Logout
export const logout = async (_req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};
