import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import AppError from '../../utils/AppError';
import catchRouteError from '../../utils/catchRouteError';

const prisma = new PrismaClient();

export const cancelEvent = catchRouteError(
    async (req: Request, res: Response, next: NextFunction) => {
        const { uid: userId } = req.userData;
        const { eventId } = req.params;

        // Check is user is author
        const isUserEventAuthor = await prisma.event.findUnique({
            where: {
                id: eventId,
                authorId: userId,
            },
            select: {
                authorId: true,
            },
        });

        if (!isUserEventAuthor) {
            return next(
                new AppError(
                    403,
                    'only the organizer of the event can cancel it'
                )
            );
        }

        const cancelEvent = prisma.event.update({
            where: {
                id: eventId,
                authorId: userId,
                isCancelled: false,
            },
            data: {
                isCancelled: true,
            },
        });

        const deleteParticipants = prisma.participant.deleteMany({
            where: {
                eventId,
            },
        });

        await prisma.$transaction([cancelEvent, deleteParticipants]);

        res.sendStatus(204);
    }
);
