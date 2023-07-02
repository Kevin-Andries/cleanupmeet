import { Prisma } from '@prisma/client';
import { Response } from 'express';

const prismaErrorsList = [
    {
        code: 'P2002',
        statusCode: 403,
        errorMessage: 'a unique constraint is not respected (p)',
    },
    {
        code: 'P2025',
        statusCode: 404,
    },
    {
        code: 'P2003',
        statusCode: 404,
        errorMessage: 'not found',
    },
];

export default (err: Prisma.PrismaClientKnownRequestError, res: Response) => {
    console.log('PrismaClientKnownRequestError', err);

    const prismaErrorObject = prismaErrorsList.find(
        (prismaError) => prismaError.code === err.code
    );
    if (!prismaErrorObject) {
        //! CRITICAL
        return res.status(500).json({
            errorMessage: 'PrismaClientKnownRequestError - fatal error',
        });
    }

    if (!prismaErrorObject.errorMessage) {
        return res.sendStatus(prismaErrorObject.statusCode);
    }

    return res.status(prismaErrorObject.statusCode).json({
        errorMessage: prismaErrorObject.errorMessage,
    });
};
