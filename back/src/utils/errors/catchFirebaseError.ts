import { NextFunction } from 'express';

export default (err: any, next: NextFunction) => {
    err.isFirebaseError = true;
    return next(err);
};
