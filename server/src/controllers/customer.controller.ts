import { Request, Response } from 'express';
import { CustomerService } from '../services/customer.service';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';

const customerService = new CustomerService();

export const getCustomers = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));

  const data = await customerService.getAllCustomers({
    page,
    limit,
    search: req.query.search as string,
    sortBy: (req.query.sortBy as string) || 'createdAt'
  });

  res.json(new ApiResponse(true, data));
});

export const getCustomerById = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const data = await customerService.getCustomerById(id);
    res.json(new ApiResponse(true, data));
});