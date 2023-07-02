import { NextFunction, Request, Response } from 'express';
import { addParticipantToEventQuery } from '../../../db/queriesFunctions/addParticipantToEventQuery';
import AppError from '../../../utils/AppError';
import catchRouteError from '../../../utils/catchRouteError';
import parseValidationErrorMessage from '../../../validation/parseValidationErrorMessage';
import validateJoinEventForm from '../../../validation/validateJoinEventForm';

export const joinPublicEvent = catchRouteError(
    async (req: Request, res: Response, next: NextFunction) => {
        const { eventIdOrSlug } = req.params;
        const userId = req.userData.uid;

        const isJoinEventFormInvalid = validateJoinEventForm(req.body);

        if (isJoinEventFormInvalid) {
            return next(
                new AppError(
                    400,
                    parseValidationErrorMessage(isJoinEventFormInvalid.message)
                )
            );
        }

        await addParticipantToEventQuery({
            eventIdOrSlug,
            userId,
            accompanyingPeople: req.body.accompanyingPeople,
        });

        res.sendStatus(204);
    }
);
