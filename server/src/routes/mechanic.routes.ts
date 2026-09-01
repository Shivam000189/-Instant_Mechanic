import { Router } from 'express';
import { getMechanics, getMechanicById, updateMechanicStatus } from '../controllers/mechanic.controller';

const router = Router();
router.get('/', getMechanics);
router.get('/:id', getMechanicById);
router.patch('/:id/status', updateMechanicStatus);

export default router;