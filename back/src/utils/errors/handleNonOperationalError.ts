import { Prisma } from '@prisma/client';
import {
    NotFoundError,
    PrismaClientValidationError,
} from '@prisma/client/runtime';
import { Response } from 'express';
import handleFirebaseError from './handleFirebaseError';
import handlePrismaKnownRequestError from './handlePrismaKnownRequestError';
import handlePrismaUnknownRequestError from './handlePrismaUnknownRequestError';

export default (err: Error | any, res: Response) => {
    console.log('handleNonOperationalError', err);
    // This error can be anything that failed in a route
    // Case if the error comes from Firebase
    if (err.isFirebaseError) {
        return handleFirebaseError(err, res);
    }

    // Case if the error comes from querying the DB (Prisma error)
    if (err instanceof NotFoundError) {
        return res.sendStatus(404);
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        return handlePrismaKnownRequestError(err, res);
    }
    if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        return handlePrismaUnknownRequestError(err, res);
    }
    if (err instanceof PrismaClientValidationError) {
        //! CRITICAL (means validation is not working properly somewhere)
        return res.status(400).json({
            errorMessage: 'invalid fields (p)',
        });
    }

    //! CRITICAL
    // Unhandled cases (should never happen but who knows...)
    return res.status(500).json({ errorMessage: 'fatal error' });
};
