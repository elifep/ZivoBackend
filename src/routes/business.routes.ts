import express from 'express';
import * as businessController from '../controllers/business.controller';
import { authenticate } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = express.Router();

router.get('/', businessController.getBusinesses);
router.get('/nearby', businessController.getNearbyBusinesses);
router.get('/search', businessController.searchBusinesses);
router.get('/top-rated', businessController.getTopRated);
router.get('/most-booked', businessController.getMostBooked);

router.get('/:id', businessController.getBusiness);
router.get('/user/:userId', businessController.getBusinessesByUserId);
router.post('/', authenticate(['business']), upload.single('image'), businessController.createBusiness);
router.put('/:id', authenticate(['business']), upload.single('image'), businessController.updateBusiness);
router.delete('/:id', authenticate(['business']), businessController.deleteBusiness);

export default router;
