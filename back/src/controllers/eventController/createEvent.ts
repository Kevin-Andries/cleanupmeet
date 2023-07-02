import { EventParticipantTypeEnum, PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import eventChecklist from '../../utils/eventChecklist.json';
import AppError from '../../utils/AppError';
import parseValidationErrorMessage from '../../validation/parseValidationErrorMessage';
import validateCreateEventForm from '../../validation/validateCreateEventForm';
import catchRouteError from '../../utils/catchRouteError';
import { firebaseStorage } from '../../utils/firebase';
import {
    getPictureExtension,
    uploadOnePictureToFirebase,
} from '../../utils/uploadOnePictureToFirebase';
import { parseBooleanValuesInFormData } from '../../utils/parseBooleanValuesInFormData';
import { deletePictureFromDisk } from '../../utils/deletePictureDromDisk';
import slugify from 'slugify';

const prisma = new PrismaClient();

// TODO: process picture with sharp

export const createEvent = catchRouteError(
    async (req: Request, res: Response, next: NextFunction) => {
        let eventForm = req.body;
        const eventPicture = req.file;
        let createdEvent, pictureId, pictureURL, firebasePictureDestination;

        delete eventForm.picture;

        res.on('finish', () => {
            if (eventPicture) {
                deletePictureFromDisk(eventPicture.path);
            }
        });

        // This is because in form-data everything arrives as a string
        eventForm = parseBooleanValuesInFormData(eventForm);

        // Validate event form
        const isEventFormInvalid = validateCreateEventForm(eventForm);

        if (isEventFormInvalid) {
            return next(
                new AppError(
                    400,
                    parseValidationErrorMessage(isEventFormInvalid.message)
                )
            );
        }

        // Change date string from body to a Date object for db
        eventForm.date = new Date(eventForm.date);

        // Handle picture
        if (eventPicture) {
            firebasePictureDestination = `eventPicture`;
            ({ pictureId, pictureURL } = await uploadOnePictureToFirebase(
                eventPicture,
                firebasePictureDestination
            ));
        }

        // TODO: Get coordinates from address

        // Create event in DB
        try {
            createdEvent = await prisma.event.create({
                data: {
                    ...eventForm,
                    acceptCoOrganizer: false,
                    authorId: req.userData.uid,
                    slug: slugify(eventForm.name, {
                        lower: true,
                        strict: true,
                    }),
                    coordinates: '54.9844, 98.6573',
                    checklist: eventChecklist,
                    participants: {
                        create: {
                            userId: req.userData.uid,
                            accompanyingPeople: 0,
                            type: EventParticipantTypeEnum.ORGANIZER,
                        },
                    },
                    pictures: eventPicture && {
                        create: {
                            id: pictureId + getPictureExtension(eventPicture),
                            url: pictureURL,
                            isMainPicture: true,
                        },
                    },
                },
                include: {
                    pictures: true,
                },
            });

            createdEvent.pictures.forEach((picture) => {
                // @ts-ignore
                delete picture.eventId;
                // @ts-ignore
                delete picture.extension;
            });
        } catch (err) {
            if (eventPicture && firebasePictureDestination) {
                const picture = firebaseStorage.file(
                    `${firebasePictureDestination}/${pictureId}${getPictureExtension(
                        eventPicture
                    )}`
                );
                await picture.delete();
            }

            throw err;
        }

        res.status(201).json(createdEvent);
    }
);
