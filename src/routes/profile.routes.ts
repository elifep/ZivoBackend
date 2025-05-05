// src/routes/profile.routes.ts
import { Router } from 'express';
import * as profileController from '../controllers/profile.controller';
import { authenticate } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

router.get('/', authenticate, profileController.getProfiles);
// router.get('/me', authenticate, (req, res) => {
//     console.log('✅ /profile/me çalıştı!');
//     res.json({ message: 'me çalıştı' });
//   });
  
router.get('/me', authenticate, profileController.getOwnProfile);

router.get('/user/:userId', authenticate, profileController.getProfileByUserId);
router.get('/:id', authenticate, profileController.getProfile);

router.put('/me', authenticate, upload.single('image'), profileController.updateOwnProfile);

router.post('/', authenticate, profileController.createProfile);
router.put('/:id', authenticate, profileController.updateProfile);
router.put('/user/:userId', authenticate, profileController.updateProfileByUserId);
router.delete('/user/:userId', authenticate, profileController.deleteProfileByUserId);
router.delete('/:id', authenticate, profileController.deleteProfile);

export default router;