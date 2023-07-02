import { NextFunction, Request, Response } from 'express';
import { createParticipationRequestQuery } from '../../../db/queriesFunctions/createParticipationRequestQuery';
import AppError from '../../../utils/AppError';
import catchRouteError from '../../../utils/catchRouteError';
import parseValidationErrorMessage from '../../../validation/parseValidationErrorMessage';
import validateCreateParticipationRequestForm from '../../../validation/validateCreateParticipationRequestForm';

export const createParticipationRequest = catchRouteError(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.userData.uid;
        const { eventId } = req.params;
        const participationRequestForm = req.body;

        const isParticipationFormInvalid =
            validateCreateParticipationRequestForm(participationRequestForm);

        if (isParticipationFormInvalid) {
            return next(
                new AppError(
                    400,
                    parseValidationErrorMessage(
                        isParticipationFormInvalid.message
                    )
                )
            );
        }

        await createParticipationRequestQuery({
            userId,
            eventId,
            participationRequestForm,
        });

        res.sendStatus(204);
    }
);
