import { Router } from 'express';
import * as controller from '../controllers/appointment.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/user', authenticate, controller.getUserAppointments);
router.get('/business/:businessId', controller.getBusinessAppointments);
router.post('/', authenticate, controller.createAppointment);
router.put('/:id/status', controller.updateStatus);
router.delete('/:id', controller.deleteAppointment);

export default router;