import express from 'express';
import * as businessController from '../controllers/business.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', businessController.getBusinesses);
router.get('/:id', businessController.getBusiness);
router.get('/user/:userId', businessController.getBusinessesByUserId);
router.post('/',authenticate, businessController.createBusiness);
router.put('/:id',authenticate, businessController.updateBusiness);
router.delete('/:id',authenticate, businessController.deleteBusiness);

export default router;
