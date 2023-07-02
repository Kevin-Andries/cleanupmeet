import { Router } from 'express';

import { createEvent } from '../../controllers/eventController/createEvent';
import { cancelEvent } from '../../controllers/eventController/cancelEvent';
import protect from '../../utils/protect';
import { getEvent } from '../../controllers/eventController/getEvent';
import { updateEvent } from '../../controllers/eventController/updateEvent';
import eventCommentRouter from './eventCommentRouter/eventCommentRouter';
import participantRouter from './participantRouter/participantRouter';
import participationRequestRouter from './participationRequestRouter/participationRequestRouter';
import decodeToken from '../../utils/decodeToken';
import { deleteEventPicture } from '../../controllers/eventController/deleteEventPicture';
import { uploadOnePicture } from '../../utils/multer';

const router = Router();

// Create
router.post('/', protect, uploadOnePicture('picture'), createEvent);

// Get
router.get('/:eventIdOrSlug', decodeToken, getEvent);

// Updates
router.delete('/:eventIdOrSlug', protect, cancelEvent);
router.put(
    '/:eventIdOrSlug',
    protect,
    uploadOnePicture('picture'),
    updateEvent
);
router.delete('/picture/:pictureId', protect, deleteEventPicture);

// ** Sub routers **
// Participation request
router.use(
    '/:eventIdOrSlug?/participation-request',
    participationRequestRouter
);
// Participant
router.use('/:eventIdOrSlug/participant', participantRouter);
// Comment
router.use('/:eventIdOrSlug?/comment', eventCommentRouter);

export default router;
