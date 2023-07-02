import firebaseAdmin, { ServiceAccount } from 'firebase-admin';
import serviceAccount from '../config/serviceAccountKey.json';

export const firebaseApp = firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount as ServiceAccount),
});

export const firebaseStorage = firebaseApp
    .storage()
    .bucket(process.env.FIREBASE_STORAGE_BUCKET);
