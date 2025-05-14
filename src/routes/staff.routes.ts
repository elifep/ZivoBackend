import { Router } from 'express';
import * as staffController from '../controllers/staff.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/business/:businessId', staffController.getStaffByBusiness);
router.post('/', authenticate(['user']), staffController.createStaff);
router.put('/:id', authenticate(['user']), staffController.updateStaff);
router.delete('/:id', authenticate(['user']), staffController.deleteStaff);

export default router;