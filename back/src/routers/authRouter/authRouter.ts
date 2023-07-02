import { Router } from 'express';
import protect from '../../utils/protect';
import { createUser } from '../../controllers/authController/createUser';
import { signIn } from '../../controllers/authController/signIn';
import { isLoggedIn } from '../../controllers/authController/isLoggedIn';
import { logOut } from '../../controllers/authController/logOut';

const router = Router();

// Routes
router.post('/user', createUser);
router.post('/sign-in', signIn);
router.get('/is-logged-in', protect, isLoggedIn);
router.get('/log-out', protect, logOut);

export default router;
