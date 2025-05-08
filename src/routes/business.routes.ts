import express from 'express';
import * as businessController from '../controllers/business.controller';
import { authenticate } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = express.Router();

router.get('/', businessController.getBusinesses);
router.get('/:id', businessController.getBusiness);
router.get('/user/:userId', businessController.getBusinessesByUserId);
router.post('/', authenticate, upload.single('image'), businessController.createBusiness);
router.put('/:id', authenticate, upload.single('image'), businessController.updateBusiness);
router.delete('/:id', authenticate, businessController.deleteBusiness);

export default router;
