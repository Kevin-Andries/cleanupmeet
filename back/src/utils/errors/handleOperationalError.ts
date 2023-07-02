import { Response } from 'express';
import AppError from '../AppError';

export default (err: AppError, res: Response) => {
    // This is an error raised manually by the developer
    if (!err.message) {
        return res.sendStatus(err.code);
    }

    res.status(err.code).json({ errorMessage: err.message });
};
