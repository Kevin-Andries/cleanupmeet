import { Router } from 'express';
import { getMe } from '../../controllers/userController/getMe/getMe';
import { getUser } from '../../controllers/userController/getUser/getUser';
import { updateProfile } from '../../controllers/userController/updateProfile/updateProfile';
import { uploadOnePicture } from '../../utils/multer';
import protect from '../../utils/protect';

const router = Router();

// Routes
router.get('/me', protect, getMe);
router.get('/:userId', getUser);

// Profile
router.put('/profile', protect, uploadOnePicture('picture'), updateProfile);

export default router;
