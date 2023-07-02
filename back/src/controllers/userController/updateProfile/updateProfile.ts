import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import AppError from '../../../utils/AppError';
import catchRouteError from '../../../utils/catchRouteError';
import { deletePictureFromDisk } from '../../../utils/deletePictureDromDisk';
import { firebaseStorage } from '../../../utils/firebase';
import { parseBooleanValuesInFormData } from '../../../utils/parseBooleanValuesInFormData';
import {
    getPictureExtension,
    uploadOnePictureToFirebase,
} from '../../../utils/uploadOnePictureToFirebase';
import parseValidationErrorMessage from '../../../validation/parseValidationErrorMessage';
import validateUpdateProfileForm from '../../../validation/validateUpdateProfileForm';

const prisma = new PrismaClient();

export const updateProfile = catchRouteError(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.userData.uid;
        const newProfilePicture = req.file;
        let profileForm = req.body,
            updatedUser,
            newProfilePictureId,
            newProfilePictureURL,
            newProfilePictureExtension,
            firebasePictureDestination;

        delete profileForm.picture;

        res.on('finish', () => {
            if (newProfilePicture) {
                deletePictureFromDisk(newProfilePicture.path);
            }
        });

        // This is because in form-data everything arrives as a string
        profileForm = parseBooleanValuesInFormData(profileForm);

        console.log(profileForm);

        // Validate profile form
        const isProfileFormInvalid = validateUpdateProfileForm(profileForm);

        if (isProfileFormInvalid) {
            return next(
                new AppError(
                    400,
                    parseValidationErrorMessage(isProfileFormInvalid.message)
                )
            );
        }

        if (profileForm.deletePicture && newProfilePicture) {
            return next(
                new AppError(
                    400,
                    "you can't delete your profile picture and upload a new one at the same time"
                )
            );
        }

        if (profileForm.birthDate) {
            profileForm.birthDate = new Date(profileForm.birthDate);
        }

        if (newProfilePicture || profileForm.deletePicture) {
            firebasePictureDestination = `profilePicture`;

            if (newProfilePicture) {
                newProfilePictureExtension =
                    getPictureExtension(newProfilePicture);

                // upload new picture
                ({
                    pictureId: newProfilePictureId,
                    pictureURL: newProfilePictureURL,
                } = await uploadOnePictureToFirebase(
                    newProfilePicture,
                    firebasePictureDestination
                ));

                profileForm.pictureId = `${newProfilePictureId}${newProfilePictureExtension}`;
                profileForm.pictureURL = newProfilePictureURL;
            }

            // delete previous picture
            const userFromDb = await prisma.user.findUnique({
                where: {
                    id: userId,
                },
                select: {
                    pictureId: true,
                },
            });

            const previousPicture = firebaseStorage.file(
                `${firebasePictureDestination}/${userFromDb?.pictureId}`
            );

            try {
                await previousPicture.delete();
            } catch (err) {
                // @ts-ignore
                if (err.code !== 404) {
                    throw err;
                }
            }
        }

        try {
            if (profileForm.deletePicture) {
                profileForm.pictureId = null;
                delete profileForm.deletePicture;
            }

            updatedUser = await prisma.user.update({
                where: {
                    id: userId,
                },
                data: profileForm,
            });
        } catch (err) {
            if (newProfilePicture && firebasePictureDestination) {
                const picture = firebaseStorage.file(
                    `${firebasePictureDestination}/${newProfilePictureId}${newProfilePictureExtension}}`
                );
                picture.delete();
            }

            throw err;
        }

        res.status(200).json(updatedUser);
    }
);
