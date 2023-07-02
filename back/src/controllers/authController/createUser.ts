import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import AppError from '../../utils/AppError';
import catchRouteError from '../../utils/catchRouteError';
import catchFirebaseError from '../../utils/errors/catchFirebaseError';
import { firebaseApp } from '../../utils/firebase';
import parseValidationErrorMessage from '../../validation/parseValidationErrorMessage';
import validateCreateUserForm from '../../validation/validateCreateUserForm';

const prisma = new PrismaClient();

export const createUser = catchRouteError(
    async (req: Request, res: Response, next: NextFunction) => {
        // Validate user form
        const isUserFormInvalid = validateCreateUserForm(req.body);

        if (isUserFormInvalid) {
            return next(
                new AppError(
                    400,
                    parseValidationErrorMessage(isUserFormInvalid.message)
                )
            );
        }

        // Create user in firebase
        let firebaseUser;
        try {
            firebaseUser = await firebaseApp.auth().createUser({
                email: req.body.email.toLowerCase(),
                password: req.body.password,
            });
        } catch (err: any) {
            return catchFirebaseError(err, next);
        }

        // Create user & user profile in DB
        let dbUser;
        try {
            dbUser = await prisma.user.create({
                data: {
                    id: firebaseUser.uid,
                    email: firebaseUser.email?.toLowerCase()!,
                    name: req.body.name,
                },
                include: {
                    createdEvents: true,
                    participationInEvents: true,
                },
            });
        } catch (err) {
            // If creating the user in DB failed, we delete him from Firebase
            firebaseApp.auth().deleteUser(firebaseUser.uid);
            return next(err);
        }

        // Fetch token from firebase on behalf of user
        const token = await fetch(
            'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyAfA7-QusjQzU3sKdkRUUFaiYdxtRGedYw',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: req.body.email,
                    password: req.body.password,
                    returnSecureToken: true,
                }),
            }
        ).then((res) => res.json());

        res.cookie('token', token.idToken);
        res.status(201).json(dbUser);
    }
);
