import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import AppError from '../../../utils/AppError';
import catchRouteError from '../../../utils/catchRouteError';
import parseValidationErrorMessage from '../../../validation/parseValidationErrorMessage';
import validateEventCommentForm from '../../../validation/validateCreateEventCommentForm';

const prisma = new PrismaClient();

export const createEventComment = catchRouteError(
    async (req: Request, res: Response, next: NextFunction) => {
        const { eventId } = req.params;
        const commentForm = req.body;

        if (!eventId) {
            return next(new AppError(400, 'eventId is missing'));
        }

        // Validate comment form
        const isCommentFormValid = validateEventCommentForm(commentForm);

        if (isCommentFormValid) {
            return next(
                new AppError(
                    400,
                    parseValidationErrorMessage(isCommentFormValid.message)
                )
            );
        }

        const createdComment = await prisma.eventComment.create({
            data: {
                eventId,
                authorId: req.userData.uid,
                comment: commentForm.comment,
            },
        });

        res.status(201).json(createdComment);
    }
);
