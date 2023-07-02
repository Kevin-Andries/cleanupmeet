import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

/**
 * Extends Express req object type definition to add our own userData.
 * That way, it prevents type error when we want to set it during auth.
 */

declare global {
    declare namespace Express {
        interface Request {
            userData: DecodedIdToken;
        }
    }
}
