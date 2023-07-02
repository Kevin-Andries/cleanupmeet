import { Router } from 'express';
import protect from '../../../utils/protect';
import { createParticipationRequest } from '../../../controllers/eventController/participationRequestController/createParticipationRequest';
import { answerParticipationRequest } from '../../../controllers/eventController/participationRequestController/answerParticipationRequest';

const router = Router({ mergeParams: true });

// Create
router.post('/', protect, createParticipationRequest);

router.post('/:participationRequestId', protect, answerParticipationRequest);

export default router;
