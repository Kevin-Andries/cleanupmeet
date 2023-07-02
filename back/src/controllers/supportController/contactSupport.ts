import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import AppError from '../../utils/AppError';

import catchRouteError from '../../utils/catchRouteError';
import parseValidationErrorMessage from '../../validation/parseValidationErrorMessage';
import validateContactForm from '../../validation/validateContactForm';

const prisma = new PrismaClient();

export const contactSupport = catchRouteError(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.userData?.uid;
        const contactForm = req.body;
        const { message, email } = contactForm;
        const isContactFormInvalid = validateContactForm(contactForm);

        if (isContactFormInvalid) {
            return next(
                new AppError(
                    400,
                    parseValidationErrorMessage(isContactFormInvalid.message)
                )
            );
        }

        if (!userId && !email) {
            return next(new AppError(400, 'token or email missing'));
        }

        if (userId && email) {
            return next(new AppError(400, 'only token OR email'));
        }

        await prisma.contactForm.create({
            data: {
                authorId: userId,
                authorEmail: email,
                message,
            },
        });

        res.sendStatus(204);
    }
);
