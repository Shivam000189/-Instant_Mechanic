import prisma from "../config/prisma";
import { hashPassword, comparePassword } from "../utils/hash";

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthError {
  statusCode: number;
  message: string;
}

export const registerUser = async ({ name, email, password }: RegisterInput) => {
  const normalizedEmail = email.trim().toLowerCase();

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existingUser) {
    const error: AuthError = {
      statusCode: 409,
      message: "An account with this email already exists",
    };
    throw error;
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create new user
  const user = await prisma.user.create({
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

export const loginUser = async ({ email, password }: LoginInput) => {
  const normalizedEmail = email.trim().toLowerCase();

  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    const error: AuthError = {
      statusCode: 404,
      message: "No account found with this email. Please sign up first.",
    };
    throw error;
  }

  // Verify password
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    const error: AuthError = {
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

export const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
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
    const error: AuthError = {
      statusCode: 404,
      message: "User not found",
    };
    throw error;
  }

  return user;
};
