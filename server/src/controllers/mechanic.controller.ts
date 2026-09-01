import { Request, Response } from 'express';
import { MechanicService } from '../services/mechanic.service';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { MechanicStatus } from '@prisma/client';

const mechanicService = new MechanicService();

export const getMechanics = asyncHandler(async (req: Request, res: Response) => {
  const data = await mechanicService.getAllMechanics({
    status: req.query.status as MechanicStatus,
    search: req.query.search as string
  });
  res.json(new ApiResponse(true, data));
});

export const getMechanicById = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const data = await mechanicService.getMechanicById(id);
  res.json(new ApiResponse(true, data));
});

export const updateMechanicStatus = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { status, reason } = req.body;
  const data = await mechanicService.updateStatus(id, status as MechanicStatus, reason);
  res.json(new ApiResponse(true, data));
});