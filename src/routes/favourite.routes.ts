import { Router } from 'express';
import * as favouriteController from '../controllers/favourite.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, favouriteController.getMyFavourites);
router.post('/', authenticate, favouriteController.addToFavourites);
router.delete('/:businessId', authenticate, favouriteController.removeFromFavourites);

export default router;