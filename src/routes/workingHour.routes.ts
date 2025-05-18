// File: src/services/workingHour.service.ts
import { Router } from 'express';
import * as controller from '../controllers/workingHour.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// GET herkes erişebilir
router.get('/:businessId', controller.getWorkingHours);

// SADECE 'business' rolündeki kullanıcılar POST ve PUT yapabilir
router.post('/', authenticate(['business']), controller.createWorkingHour);
router.put('/:id', authenticate(['business']), controller.updateWorkingHour);

// Silme işlemi opsiyonel olarak business'e sınırlandırılabilir
router.delete('/:id', authenticate(['business']), controller.deleteWorkingHour);

export default router;