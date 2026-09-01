import { Customer, Mechanic, User } from '@prisma/client';

export type RequestUser =
  | Customer
  | Mechanic
  | User
  | {
      id: string;
      email: string;
      name: string;
      avatarUrl?: string | null;
    };

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      user?: RequestUser;
    }
  }
}