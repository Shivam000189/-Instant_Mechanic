import { Request, Response } from 'express';
import { DashboardService } from '../services/dashboard.service';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';

const dashboardService = new DashboardService();

export const getDashboard = asyncHandler(async (req: Request, res: Response) => {
  const { period } = req.query as { period?: string };
  const data = await dashboardService.getOverview(period);
  res.json(new ApiResponse(true, data));
});