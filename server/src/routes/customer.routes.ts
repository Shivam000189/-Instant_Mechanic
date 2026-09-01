import { Router } from 'express';
import { getCustomers, getCustomerById } from '../controllers/customer.controller';

const router = Router();
router.get('/', getCustomers);
router.get('/:id', getCustomerById);

export default router;