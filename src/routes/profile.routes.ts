// src/routes/profile.routes.ts
import { Router } from 'express';
import * as profileController from '../controllers/profile.controller';
import { authenticate } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

router.get('/', authenticate(['user']), profileController.getProfiles);
// router.get('/me', authenticate, (req, res) => {
//     console.log('✅ /profile/me çalıştı!');
//     res.json({ message: 'me çalıştı' });
//   });

router.get('/me', authenticate(['user']), profileController.getOwnProfile);

router.get('/user/:userId', authenticate(['user']), profileController.getProfileByUserId);
router.get('/:id', authenticate(['user']), profileController.getProfile);

router.put('/me', authenticate(['user']), upload.single('image'), profileController.updateOwnProfile);

router.post('/', authenticate(['user']), profileController.createProfile);
router.put('/:id', authenticate(['user']), profileController.updateProfile);
router.put('/user/:userId', authenticate(['user']), profileController.updateProfileByUserId);
router.delete('/user/:userId', authenticate(['user']), profileController.deleteProfileByUserId);
router.delete('/:id', authenticate(['user']), profileController.deleteProfile);

export default router;