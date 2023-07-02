import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import AppError from '../../utils/AppError';
import catchRouteError from '../../utils/catchRouteError';
import parseValidationErrorMessage from '../../validation/parseValidationErrorMessage';
import validateReportForm from '../../validation/validateReportForm';

const prisma = new PrismaClient();

export const createReport = catchRouteError(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.userData.uid;
        const reportForm = req.body;
        const { reporterUserId, reportedUserId, eventId, message } = reportForm;

        if (!reportedUserId && !eventId) {
            return next(
                new AppError(400, 'user or event to report is missing')
            );
        }

        if (reportedUserId && eventId) {
            return next(new AppError(400, 'report only user OR event at once'));
        }

        const isReportFormInvalid = validateReportForm(reportForm);

        if (isReportFormInvalid) {
            return next(
                new AppError(
                    400,
                    parseValidationErrorMessage(isReportFormInvalid.message)
                )
            );
        }

        // Check if user has already created this report
        const hasAlreadyCreatedReport = await prisma.report.findFirst({
            where: {
                OR: [
                    {
                        reporterUserId,
                        reportedUserId,
                    },
                    {
                        reporterUserId,
                        eventId,
                    },
                ],
            },
        });

        if (hasAlreadyCreatedReport) {
            return next(
                new AppError(401, 'this report has already been created')
            );
        }

        await prisma.report.create({
            data: {
                reporterUserId: userId,
                reportedUserId,
                eventId,
                message: message,
            },
        });

        res.sendStatus(204);
    }
);
