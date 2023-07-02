// @ts-nocheck
import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import catchRouteError from '../../../utils/catchRouteError';

const prisma = new PrismaClient();

export const getParticipant = catchRouteError(
    async (req: Request, res: Response, _next: NextFunction) => {
        const { participantUserId } = req.params;

        const participant = await prisma.user.findUniqueOrThrow({
            where: {
                id: participantUserId,
            },
            select: {
                id: true,
                name: true,
                pictureURL: true,
            },
        });

        res.json(participant);
    }
);
