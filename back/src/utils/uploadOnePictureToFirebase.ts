import path from 'path';
import { v4 } from 'uuid';
import AppError from './AppError';
import validatePictureExtension from './validatePictureExtension';
import { firebaseStorage } from './firebase';

export async function uploadOnePictureToFirebase(
    picture: Express.Multer.File,
    firebasePictureDestination: string
) {
    let pictureId, pictureURL;
    const pictureExtension = getPictureExtension(picture);
    const isPictureExtensionValid = validatePictureExtension(pictureExtension);

    if (!isPictureExtensionValid) {
        throw new AppError(400, 'incorrect extension for event picture');
    }

    pictureId = v4();

    // Upload picture to firebase
    try {
        const res = await firebaseStorage.upload(picture.path, {
            destination: `${firebasePictureDestination}/${pictureId}${pictureExtension}`,
        });

        pictureURL = (
            await res[0].getSignedUrl({
                action: 'read',
                expires: '03-09-2491',
            })
        )[0];
    } catch (err) {
        throw new AppError(500, 'error while uploading file to storage');
    }

    return { pictureId, pictureURL };
}

export function getPictureExtension(picture: Express.Multer.File) {
    return path.extname(picture.originalname);
}
