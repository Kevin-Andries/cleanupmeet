import { EventParticipantTypeEnum, PrismaClient } from '@prisma/client';
import { QueryOptions, UserId } from '../../types/AppTypes';
import AppError from '../../utils/AppError';
import { getEventQuery } from './getEventQuery';
import { getParticipantQuery } from './getParticipantQuery';

const prismaClient = new PrismaClient();

interface QueryData {
    eventIdOrSlug: string;
    userId: UserId;
    accompanyingPeople?: number;
}

export async function addParticipantToEventQuery(
    { eventIdOrSlug, userId, accompanyingPeople }: QueryData,
    { prisma = prismaClient }: QueryOptions = { prisma: prismaClient }
) {
    // Check if event exists
    await getEventQuery(eventIdOrSlug, {
        prisma,
    });

    // Check if user is already a participant
    // const isUserAlreadyParticipant = await getParticipantQuery(
    //     { id: eventIdOrSlug, slug: '', userId },
    //     { prisma, findUniqueOrThrow: false }
    // );

    // if (isUserAlreadyParticipant) {
    //     throw new AppError(403, 'user is already a participant');
    // }

    // Add the participant to the event
    await prisma.participant.create({
        data: {
            eventId: eventIdOrSlug,
            slug: 'great-pickup-in-the-landcasters-park',
            userId,
            type: EventParticipantTypeEnum.PARTICIPANT,
            accompanyingPeople: accompanyingPeople || 0,
        },
    });
}
