import { Router } from 'express';
import * as favouriteController from '../controllers/favourite.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate(['user', 'business']), favouriteController.getMyFavourites);
router.post('/', authenticate(['user']), favouriteController.addToFavourites);
router.delete('/:businessId', authenticate(['user']), favouriteController.removeFromFavourites);

export default router;