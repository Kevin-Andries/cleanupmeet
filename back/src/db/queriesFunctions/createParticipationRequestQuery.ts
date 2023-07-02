import { PrismaClient } from '@prisma/client';
import { EventId, QueryOptions, UserId } from '../../types/AppTypes';
import AppError from '../../utils/AppError';
import { getParticipantQuery } from './getParticipantQuery';

const prismaClient = new PrismaClient();

interface QueryData {
    userId: UserId;
    eventId: EventId;
    participationRequestForm: any;
}

export async function createParticipationRequestQuery(
    { userId, eventId, participationRequestForm }: QueryData,
    { prisma = prismaClient }: QueryOptions = { prisma: prismaClient }
) {
    const isUserAlreadyParticipant = await getParticipantQuery(
        { userId, id: eventId, slug: '' },
        { findUniqueOrThrow: false }
    );

    if (isUserAlreadyParticipant) {
        throw new AppError(403, 'user is already a participant');
    }

    const hasUserAlreadySentParticipationRequest =
        await prisma.participationRequest.findFirst({
            where: {
                userId,
                eventId,
            },
        });

    if (hasUserAlreadySentParticipationRequest) {
        throw new AppError(
            403,
            'a participation request has already been submitted'
        );
    }

    await prisma.participationRequest.create({
        data: {
            ...participationRequestForm,
            eventId,
            userId,
        },
    });
}
