import { PrismaClient } from '@prisma/client';
import { EventId, QueryOptions } from '../../types/AppTypes';

const prismaClient = new PrismaClient();

export async function getEventQuery(
    eventId: EventId,
    { prisma = prismaClient }: QueryOptions = { prisma: prismaClient }
) {
    const event = await prisma.event.findUniqueOrThrow({
        where: {
            id: eventId,
        },
    });

    return event;
}
