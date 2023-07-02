import { Prisma } from '@prisma/client';
import { Response } from 'express';

export default (err: Prisma.PrismaClientUnknownRequestError, res: Response) => {
    console.log('PrismaClientUnknownRequestError', err);
    //! CRITICAL
    return res.status(500).json({
        errorMessage: 'PrismaClientUnknownRequestError - fatal error',
    });
};
