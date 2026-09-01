import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface JwtPayload {
  userId: string;
}

export const generateToken = (userId: string, expiresIn: string = "24h"): string => {
  return jwt.sign({ userId }, env.jwtSecret, {
    expiresIn,
  } as jwt.SignOptions);
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.jwtSecret) as JwtPayload;
};
