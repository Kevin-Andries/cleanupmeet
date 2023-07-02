import { EventParticipantTypeEnum, PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import AppError from '../../../utils/AppError';

import catchRouteError from '../../../utils/catchRouteError';

const prisma = new PrismaClient();

export const leaveEvent = catchRouteError(
    async (req: Request, res: Response, next: NextFunction) => {
        const { eventId } = req.params;

        const participant = await prisma.participant.findUniqueOrThrow({
            where: {
                userId_eventId: {
                    userId: req.userData.uid,
                    eventId,
                },
            },
        });

        if (participant.type === EventParticipantTypeEnum.ORGANIZER) {
            return next(
                new AppError(403, 'an organizer cannot leave the event')
            );
        }

        await prisma.participant.delete({
            where: {
                NOT: {
                    type: EventParticipantTypeEnum.ORGANIZER,
                },
                userId_eventId: {
                    userId: req.userData.uid,
                    eventId,
                },
            },
        });

        res.sendStatus(204);
    }
);
