import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import AppError from '../../utils/AppError';
import catchRouteError from '../../utils/catchRouteError';
import parseValidationErrorMessage from '../../validation/parseValidationErrorMessage';
import validateSignInForm from '../../validation/validateSignInForm';

const prisma = new PrismaClient();

export const signIn = catchRouteError(
    async (req: Request, res: Response, next: NextFunction) => {
        const isSignInFormInvalid = validateSignInForm(req.body);
        const { email, password } = req.body;

        if (isSignInFormInvalid) {
            return next(
                new AppError(
                    400,
                    parseValidationErrorMessage(isSignInFormInvalid.message)
                )
            );
        }

        // Get user from db
        const user = await prisma.user.findUniqueOrThrow({
            where: {
                email,
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
                        event: true,
                        joinedAt: true,
                        type: true,
                        accompanyingPeople: true,
                    },
                },
            },
        });

        // Fetch token from firebase on behalf of user
        const token = await fetch(
            'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyAfA7-QusjQzU3sKdkRUUFaiYdxtRGedYw',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    returnSecureToken: true,
                }),
            }
        ).then((res) => res.json());

        res.cookie('token', token.idToken);
        res.status(200).json(user);
    }
);
