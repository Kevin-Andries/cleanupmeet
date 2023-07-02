import { EventParticipantTypeEnum, PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';

import AppError from '../../../utils/AppError';

import catchRouteError from '../../../utils/catchRouteError';

const prisma = new PrismaClient();

export const deleteParticipant = catchRouteError(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.userData.uid;
        const { eventId, participantUserIdToDelete } = req.params;

        console.log('here', eventId);

        if (!(eventId && participantUserIdToDelete)) {
            return next(
                new AppError(
                    400,
                    'eventId or the id of the participant to delete is missing'
                )
            );
        }

        const userParticipant = await prisma.participant.findUniqueOrThrow({
            where: {
                userId_eventId: {
                    eventId,
                    userId,
                },
            },
        });

        const isUserOrganizer =
            userParticipant.type === EventParticipantTypeEnum.ORGANIZER;
        const isUserCoOrganizer =
            userParticipant.type === EventParticipantTypeEnum.CO_ORGANIZER;

        if (!isUserOrganizer && !isUserCoOrganizer) {
            return next(
                new AppError(
                    403,
                    'only a (co)organizer can delete a participant'
                )
            );
        }

        const userParticipantToDelete =
            await prisma.participant.findUniqueOrThrow({
                where: {
                    userId_eventId: {
                        eventId,
                        userId: participantUserIdToDelete,
                    },
                },
            });

        if (isUserOrganizer) {
            await prisma.participant.delete({
                where: {
                    userId_eventId: {
                        eventId,
                        userId: participantUserIdToDelete,
                    },
                },
            });

            return res.sendStatus(204);
        }

        if (
            isUserCoOrganizer &&
            userParticipantToDelete.type !==
                EventParticipantTypeEnum.PARTICIPANT
        ) {
            return next(
                new AppError(
                    403,
                    'a co organizer can only delete a normal participant'
                )
            );
        }

        await prisma.participant.delete({
            where: {
                userId_eventId: {
                    eventId,
                    userId: participantUserIdToDelete,
                },
            },
        });

        res.sendStatus(204);
    }
);
