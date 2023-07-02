import { NextFunction, Request, Response } from 'express';
import { firebaseApp } from './firebase';

export default async function decodeToken(
    req: Request,
    _res: Response,
    next: NextFunction
) {
    const token = req.headers.token || req.cookies.token;

    if (!token) return next();

    const userDataFromFirebaseToken = await firebaseApp
        .auth()
        .verifyIdToken(token)
        .catch();

    req.userData = userDataFromFirebaseToken;
    next();
}
