// @ts-nocheck
import { EventParticipantTypeEnum, PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { getParticipantQuery } from '../../db/queriesFunctions/getParticipantQuery';
import catchRouteError from '../../utils/catchRouteError';
import { getEventIdentifierForPrisma } from '../../utils/getEventIdentifierForPrisma';

const prisma = new PrismaClient();

export const getEvent = catchRouteError(
    async (req: Request, res: Response, _next: NextFunction) => {
        const { eventIdOrSlug } = req.params;
        const { userData } = req;
        let includeParticipationRequest = false;

        const eventIdentifierForPrisma =
            getEventIdentifierForPrisma(eventIdOrSlug);

        console.log(eventIdentifierForPrisma);

        if (userData) {
            const participant = await getParticipantQuery(
                {
                    userId: userData.uid,
                    ...eventIdentifierForPrisma,
                },
                {
                    findUniqueOrThrow: false,
                }
            );

            if (
                participant &&
                (participant.type === EventParticipantTypeEnum.ORGANIZER ||
                    participant.type === EventParticipantTypeEnum.CO_ORGANIZER)
            ) {
                includeParticipationRequest = true;
            }
        }

        const event = await prisma.event.findFirstOrThrow({
            where: {
                ...eventIdentifierForPrisma,
                isCancelled: false,
            },
            include: {
                participants: {
                    select: {
                        accompanyingPeople: true,
                        joinedAt: true,
                        type: true,
                        userId: true,
                    },
                },
                participationRequests: includeParticipationRequest && {
                    select: {
                        id: true,
                        createdAt: true,
                        accompanyingPeople: true,
                        message: true,
                        participantType: true,
                        displayPhoneNumber: true,
                        user: {
                            select: {
                                id: true,
                                phoneNumber: true,
                                email: true,
                            },
                        },
                    },
                },
                pictures: true,
                comments: {
                    select: {
                        id: true,
                        authorId: true,
                        createdAt: true,
                        comment: true,
                    },
                },
            },
        });

        event.participants.forEach(
            (participant: any) => delete participant.eventId
        );

        if (event.participationRequests) {
            event.participationRequests.forEach((request) => {
                if (!request.displayPhoneNumber || !request.user.phoneNumber) {
                    delete request.user.phoneNumber;
                }

                delete request.displayPhoneNumber;
            });
        }

        res.status(200).json(event);
    }
);
