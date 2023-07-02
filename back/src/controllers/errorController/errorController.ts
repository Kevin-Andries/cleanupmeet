import { NextFunction, Request, Response } from 'express';
import AppError from '../../utils/AppError';
import { CaughtError } from '../../utils/errors/CaughtErrorType';
import handleNonOperationalError from '../../utils/errors/handleNonOperationalError';
import handleOperationalError from '../../utils/errors/handleOperationalError';

export default function (
    err: CaughtError,
    _req: Request,
    res: Response,
    _next: NextFunction
) {
    if (err instanceof AppError) {
        return handleOperationalError(err, res);
    }

    return handleNonOperationalError(err, res);
}
