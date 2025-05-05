import express from 'express';
import * as socialMediaController from '../controllers/socialMedia.controller';

const router = express.Router();

router.get('/', socialMediaController.getAllSocialMedia);
router.get('/:id', socialMediaController.getSocialMediaById);
router.get('/business/:businessId', socialMediaController.getSocialMediaByBusinessId);
router.post('/', socialMediaController.createSocialMedia);
router.put('/:id', socialMediaController.updateSocialMedia);
router.delete('/:id', socialMediaController.deleteSocialMedia);

export default router;
