import { Router } from 'express';
import { joinPublicEvent } from '../../../controllers/eventController/participantController/joinEvent';
import { deleteParticipant } from '../../../controllers/eventController/participantController/deleteParticipant';
import { leaveEvent } from '../../../controllers/eventController/participantController/leaveEvent';
import protect from '../../../utils/protect';
import { getParticipant } from '../../../controllers/eventController/participantController/getParticipant';

const router = Router({ mergeParams: true });
// Create
router.post('/', protect, joinPublicEvent);

// Get
router.get('/:participantUserId', getParticipant);

// Delete
router.delete('/', protect, leaveEvent);
router.delete('/:participantUserIdToDelete', protect, deleteParticipant);

export default router;
