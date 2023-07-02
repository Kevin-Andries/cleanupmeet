import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import catchRouteError from '../../../utils/catchRouteError';

const prisma = new PrismaClient();

export const getMe = catchRouteError(
    async (req: Request, res: Response, _next: NextFunction) => {
        const user = await prisma.user.findUniqueOrThrow({
            where: {
                id: req.userData.uid,
            },
            include: {
                createdEvents: {
                    where: {
                        isCancelled: false,
                    },
                    select: {
                        id: true,
                    },
                },
                participationInEvents: {
                    select: {
                        event: {
                            include: {
                                pictures: true,
                            },
                        },
                        joinedAt: true,
                        type: true,
                        accompanyingPeople: true,
                    },
                },
            },
        });

        res.json(user);
    }
);
