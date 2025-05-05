import express from 'express';
import * as serviceController from '../controllers/services.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', serviceController.getServices);
router.get('/:id', serviceController.getServiceById);
router.get('/business/:businessId', serviceController.getServicesByBusinessId);
router.post('/',authenticate, serviceController.createService);
router.put('/:id',authenticate, serviceController.updateService);
router.delete('/:id',authenticate, serviceController.deleteService);

export default router;
