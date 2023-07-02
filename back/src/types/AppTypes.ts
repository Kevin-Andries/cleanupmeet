import { PrismaClient } from '@prisma/client';

export type EventId = string;
export type UserId = string;
export type ParticipationRequestId = string;

export interface QueryOptions {
    prisma?: PrismaClient;
    findUniqueOrThrow?: Boolean;
}
