// @ts-nocheck
import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import catchRouteError from '../../../utils/catchRouteError';

const prisma = new PrismaClient();

export const getUser = catchRouteError(
    async (req: Request, res: Response, _next: NextFunction) => {
        const { userId } = req.params;

        const user = await prisma.user.findUniqueOrThrow({
            where: {
                id: userId,
            },
            include: {
                createdEvents: {
                    include: {
                        pictures: true,
                    },
                },
                participationInEvents: true,
            },
        });

        if (!user.displayEmail) {
            delete user.email;
        }
        delete user.displayEmail;

        if (!user.displayPhoneNumber) {
            delete user.phoneNumber;
        }
        delete user.displayPhoneNumber;

        if (!user.displayBirthDate) {
            delete user.birthDate;
        }
        delete user.displayBirthDate;

        delete user.isPublic;
        delete user.isDisabled;
        delete user.isAdmin;

        user.createdEvents = user.createdEvents.filter(
            (event) => event.isCancelled === false
        );

        user.createdAt = `${user.createdAt.getFullYear()}-${
            user.createdAt.getMonth() + 1
        }`;

        res.json(user);
    }
);
