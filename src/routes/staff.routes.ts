import { Router } from 'express';
import * as staffController from '../controllers/staff.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/business/:businessId', staffController.getStaffByBusiness);
router.post('/',authenticate, staffController.createStaff);
router.put('/:id',authenticate, staffController.updateStaff);
router.delete('/:id',authenticate, staffController.deleteStaff);

export default router;