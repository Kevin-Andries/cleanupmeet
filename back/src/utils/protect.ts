import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import AppError from './AppError';
import { firebaseApp } from './firebase';

const prisma = new PrismaClient();

export default async function protect(
    req: Request,
    _res: Response,
    next: NextFunction
) {
    const token = req.headers.token || req.cookies.token;
    let userDataFromFirebaseToken;
    let isUserDisabled;

    if (!token || typeof token !== 'string') {
        return next(new AppError(401, 'missing or invalid token header'));
    }

    try {
        userDataFromFirebaseToken = await firebaseApp
            .auth()
            .verifyIdToken(token);
    } catch (err: any) {
        console.log(err);
        return next(
            new AppError(
                401,
                err.code.includes('id-token-expired')
                    ? 'your auth token has expired'
                    : 'your auth token is invalid'
            )
        );
    }

    try {
        prisma.user.update({
            where: {
                id: userDataFromFirebaseToken.uid,
            },
            data: {
                lastRequest: new Date(),
            },
        });
    } catch (err) {}

    try {
        isUserDisabled = await prisma.user.findFirst({
            where: {
                id: userDataFromFirebaseToken.uid,
                isDisabled: true,
            },
        });

        if (isUserDisabled) {
            return next(new AppError(403, 'your account is disabled'));
        }
    } catch (err) {
        return next();
    }

    req.userData = userDataFromFirebaseToken;
    next();
}
