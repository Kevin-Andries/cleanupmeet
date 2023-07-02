import { PrismaClient, PrismaPromise } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { answerParticipationRequestQuery } from '../../../db/queriesFunctions/answerParticipationRequestQuery';
import AppError from '../../../utils/AppError';
import catchRouteError from '../../../utils/catchRouteError';

export const answerParticipationRequest = catchRouteError(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.userData.uid;
        const { participationRequestId } = req.params;
        let { accept }: any = req.query;

        if (accept === 'true') {
            accept = true;
        } else if (accept === 'false') {
            accept = false;
        }

        if (typeof accept !== 'boolean') {
            return next(new AppError(400, 'missing query param with answer'));
        }

        await answerParticipationRequestQuery({
            userId,
            participationRequestId,
            accept,
        });

        res.sendStatus(204);
    }
);
