import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import AppError from '../../../utils/AppError';
import catchRouteError from '../../../utils/catchRouteError';

const prisma = new PrismaClient();

export const getEventComment = catchRouteError(
    async (req: Request, res: Response, next: NextFunction) => {
        const { commentId } = req.params;

        const comment = await prisma.eventComment.findUniqueOrThrow({
            where: {
                id: commentId,
            },
        });

        const { isCancelled: isEventCancelled } =
            await prisma.event.findUniqueOrThrow({
                where: {
                    id: comment.eventId,
                },
                select: {
                    id: true,
                    isCancelled: true,
                },
            });

        if (isEventCancelled) {
            return next(new AppError(404));
        }

        res.status(200).json(comment);
    }
);
