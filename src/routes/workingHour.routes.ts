import { Router } from 'express';
import * as controller from '../controllers/workingHour.controller';

const router = Router();

router.get('/:businessId', controller.getWorkingHours);
router.post('/', controller.createWorkingHour);
router.put('/:id', controller.updateWorkingHour);
router.delete('/:id', controller.deleteWorkingHour);

export default router;