import { Router } from 'express';
import { createReport } from '../../controllers/supportController/createReport';
import { contactSupport } from '../../controllers/supportController/contactSupport';
import protect from '../../utils/protect';
import decodeToken from '../../utils/decodeToken';

const router = Router();

// Routes
router.post('/report', protect, createReport);
router.post('/contact', decodeToken, contactSupport);

export default router;
