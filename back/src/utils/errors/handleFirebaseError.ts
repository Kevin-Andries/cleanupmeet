import { Response } from 'express';
import { FirebaseError } from 'firebase-admin';
import FirebaseErrorCodes from './firebaseErrorCodesEnum';

export default (err: FirebaseError, res: Response) => {
    if (err.code === FirebaseErrorCodes.EMAIL_ALREADY_EXISTS) {
        return res.status(403).json({
            errorMessage: 'This email is already in use',
        });
    }

    // Unhandled Firebase errors
    return res.status(500).json({
        errorMessage: 'fatal error',
    });
};
