import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import catchRouteError from '../../../utils/catchRouteError';

const prisma = new PrismaClient();

export const deleteEventComment = catchRouteError(
    async (req: Request, res: Response, next: NextFunction) => {
        const { uid: userId } = req.userData;
        const { commentId } = req.params;

        await prisma.eventComment.delete({
            where: {
                id: commentId,
                authorId: userId,
            },
        });

        res.sendStatus(204);
    }
);
