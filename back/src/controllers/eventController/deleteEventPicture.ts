import { EventParticipantTypeEnum, PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import AppError from '../../utils/AppError';
import catchRouteError from '../../utils/catchRouteError';
import { firebaseStorage } from '../../utils/firebase';

const prisma = new PrismaClient();

export const deleteEventPicture = catchRouteError(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.userData.uid;
        const { pictureId } = req.params;

        // Check if picture exists and retrieve eventId
        const { eventId } = await prisma.eventPicture.findFirstOrThrow({
            where: {
                id: pictureId,
            },
            select: {
                eventId: true,
            },
        });

        // Check if event exists and search if the current user is a participant
        const event = await prisma.event.findUniqueOrThrow({
            where: {
                id: eventId,
                isCancelled: false,
            },
            select: {
                participants: {
                    where: {
                        userId,
                    },
                    select: {
                        type: true,
                    },
                },
            },
        });

        const isUserParticipant = !!event.participants[0];

        if (!isUserParticipant) {
            return next(new AppError(403));
        }

        const participantType = event.participants[0].type;

        const isUserAuthorized =
            participantType === EventParticipantTypeEnum.ORGANIZER ||
            participantType === EventParticipantTypeEnum.CO_ORGANIZER;

        if (!isUserAuthorized) {
            return next(new AppError(403));
        }

        // Delete picture
        await prisma.eventPicture.delete({
            where: {
                id: pictureId,
            },
        });

        const firebasePicture = firebaseStorage.file(
            `eventPicture/${pictureId}`
        );
        await firebasePicture.delete();

        res.sendStatus(204);
    }
);
