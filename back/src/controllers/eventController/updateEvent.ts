import { EventParticipantTypeEnum, PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import AppError from '../../utils/AppError';
import catchRouteError from '../../utils/catchRouteError';
import { deleteOnePictureFromFirebase } from '../../utils/deleteOnePictureFromFirebase';
import { deletePictureFromDisk } from '../../utils/deletePictureDromDisk';
import { firebaseStorage } from '../../utils/firebase';
import { parseBooleanValuesInFormData } from '../../utils/parseBooleanValuesInFormData';
import {
    getPictureExtension,
    uploadOnePictureToFirebase,
} from '../../utils/uploadOnePictureToFirebase';
import parseValidationErrorMessage from '../../validation/parseValidationErrorMessage';
import validateUpdateEventForm from '../../validation/validateUpdateEventForm';

const prisma = new PrismaClient();
const FIREBASE_EVENT_PICTURE_DESTINATION = process.env
    .FIREBASE_EVENT_PICTURE_DESTINATION as string;

export const updateEvent = catchRouteError(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.userData.uid;
        const { eventId } = req.params;
        let eventForm = req.body,
            newEventPicture = req.file,
            updatedEvent,
            previousEventPicture: any,
            newEventPictureId: string,
            newEventPictureURL: string,
            newEventPictureExtension: string;

        res.on('finish', () => {
            if (newEventPicture) {
                deletePictureFromDisk(newEventPicture.path);
            }
        });

        eventForm = parseBooleanValuesInFormData(eventForm);
        eventForm.date = new Date(eventForm.date);

        // Validate event form
        const isEventFormInvalid = validateUpdateEventForm(eventForm);

        if (isEventFormInvalid) {
            return next(
                new AppError(
                    400,
                    parseValidationErrorMessage(isEventFormInvalid.message)
                )
            );
        }

        // check if event exists
        await prisma.event.findUniqueOrThrow({
            where: {
                id: eventId,
            },
        });

        if (eventForm.deletePicture && newEventPicture) {
            return next(
                new AppError(
                    400,
                    "you can't delete the event picture and upload a new one at the same time"
                )
            );
        }

        // Check if user is the organizer
        console.log(userId, eventId);
        const user = await prisma.participant.findUnique({
            where: {
                userId_eventId: {
                    userId,
                    eventId,
                },
            },
            select: {
                type: true,
            },
        });

        if (!user || user.type !== EventParticipantTypeEnum.ORGANIZER) {
            console.log('here', user);
            throw new AppError(403, 'only an organizer can update the event');
        }

        // upload new picture if there is one
        if (newEventPicture || eventForm.deletePicture) {
            if (newEventPicture) {
                newEventPictureExtension = getPictureExtension(newEventPicture);

                ({
                    pictureId: newEventPictureId,
                    pictureURL: newEventPictureURL,
                } = await uploadOnePictureToFirebase(
                    newEventPicture,
                    FIREBASE_EVENT_PICTURE_DESTINATION
                ));
            }

            // delete previous picture
            previousEventPicture = await prisma.eventPicture.findFirst({
                where: {
                    eventId,
                    isMainPicture: true,
                },
                select: {
                    id: true,
                },
            });

            if (previousEventPicture) {
                const previousPicture = firebaseStorage.file(
                    `${FIREBASE_EVENT_PICTURE_DESTINATION}/${previousEventPicture?.id}`
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
        }

        try {
            delete eventForm.deletePicture;

            await prisma.$transaction(async (prismaTransactionClient) => {
                updatedEvent = await prismaTransactionClient.event.update({
                    where: {
                        id: eventId,
                        authorId: req.userData.uid,
                        isCancelled: false,
                    },
                    data: {
                        ...eventForm,
                        pictures: newEventPicture && {
                            create: {
                                id: `${newEventPictureId}${newEventPictureExtension}`,
                                url: newEventPictureURL,
                                isMainPicture: true,
                            },
                        },
                    },
                    include: {
                        pictures: true,
                    },
                });

                updatedEvent.pictures = updatedEvent.pictures.filter(
                    (picture) => picture.id !== previousEventPicture?.id
                );

                if (previousEventPicture) {
                    await prismaTransactionClient.eventPicture.delete({
                        where: {
                            id: previousEventPicture.id,
                        },
                    });
                }
            });
        } catch (err) {
            if (newEventPicture) {
                deleteOnePictureFromFirebase(
                    newEventPictureId!,
                    FIREBASE_EVENT_PICTURE_DESTINATION
                );
            }

            throw err;
        }

        res.status(200).json(updatedEvent);
    }
);
