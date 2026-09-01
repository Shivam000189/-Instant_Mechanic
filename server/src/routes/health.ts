import { Router, Request, Response } from "express";
import prisma from "../config/prisma";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  let dbStatus = "disconnected";
  let dbError: string | null = null;

  try {
    // Perform a lightweight query to test PostgreSQL connection
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = "connected";
  } catch (error: any) {
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

export default router;
