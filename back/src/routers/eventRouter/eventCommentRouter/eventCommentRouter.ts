import { Router } from 'express';
import { createEventComment } from '../../../controllers/eventController/eventCommentController/createEventComment';
import { deleteEventComment } from '../../../controllers/eventController/eventCommentController/deleteEventComment';
import { getEventComment } from '../../../controllers/eventController/eventCommentController/getEventComment';
import protect from '../../../utils/protect';

const router = Router({ mergeParams: true });

// Create
router.post('/', protect, createEventComment);

// Get
router.get('/:commentId', getEventComment);

// Delete
router.delete('/:commentId', protect, deleteEventComment);

export default router;
