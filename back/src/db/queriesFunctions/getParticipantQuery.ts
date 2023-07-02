import { PrismaClient } from '@prisma/client';

import { EventId, QueryOptions, UserId } from '../../types/AppTypes';

const prismaClient = new PrismaClient();

interface QueryData {
    id: EventId;
    slug: string;
    userId: UserId;
}

export async function getParticipantQuery(
    { id: eventId, slug, userId }: QueryData,
    { findUniqueOrThrow, prisma = prismaClient }: QueryOptions = {
        findUniqueOrThrow: true,
    }
) {
    const prismaFunction = findUniqueOrThrow
        ? prisma.participant.findUniqueOrThrow
        : prisma.participant.findUnique;

    const participant = await prismaFunction({
        where: eventId
            ? {
                  userId_eventId: {
                      userId,
                      eventId,
                  },
              }
            : { slug },
    });

    return participant;
}
