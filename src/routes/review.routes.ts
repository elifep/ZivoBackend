import { Router } from 'express';
import * as reviewController from '../controllers/review.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', reviewController.getReviews);
router.get('/business/:businessId', reviewController.getReviewsByBusinessId);
router.get('/user/:userId', reviewController.getReviewsByUserId);
router.get('/business/:businessId/average', reviewController.getAverageRatingByBusinessId);
router.get('/:id', reviewController.getReview);
router.post('/', authenticate(['user']), reviewController.createReview);
router.put('/:id', authenticate(['user']), reviewController.updateReview);
router.delete('/:id', authenticate(['user']), reviewController.deleteReview);

export default router;