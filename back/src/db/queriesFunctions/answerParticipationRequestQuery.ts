import { EventParticipantTypeEnum, Prisma, PrismaClient } from '@prisma/client';

import {
    ParticipationRequestId,
    QueryOptions,
    UserId,
} from '../../types/AppTypes';
import AppError from '../../utils/AppError';
import { addParticipantToEventQuery } from './addParticipantToEventQuery';

const prismaClient = new PrismaClient();

interface QueryData {
    userId: UserId;
    participationRequestId: ParticipationRequestId;
    accept: boolean;
}

export async function answerParticipationRequestQuery(
    { userId, participationRequestId, accept }: QueryData,
    { prisma = prismaClient }: QueryOptions = { prisma: prismaClient }
) {
    // Get participation request
    const { eventId, userId: participantId } =
        await prisma.participationRequest.findFirstOrThrow({
            where: {
                id: participationRequestId,
            },
            select: {
                eventId: true,
                userId: true,
            },
        });

    // Check if user is (co)organizer
    const user = await prisma.participant.findUnique({
        where: {
            userId_eventId: {
                userId,
                eventId,
            },
        },
        select: {
            type: true,
        },
    });

    if (
        !user ||
        (user.type !== EventParticipantTypeEnum.ORGANIZER &&
            user.type !== EventParticipantTypeEnum.CO_ORGANIZER)
    ) {
        throw new AppError(
            403,
            'only an organizer or co organizer can answer a participation request'
        );
    }

    await prisma.$transaction(async (prismaTransactionClient: any) => {
        await prismaTransactionClient.participationRequest.delete({
            where: {
                id: participationRequestId,
            },
        });

        if (accept) {
            await addParticipantToEventQuery(
                {
                    eventIdOrSlug: eventId,
                    userId: participantId,
                },
                {
                    prisma: prismaTransactionClient,
                }
            );
        }
    });
}
