import { EventParticipantTypeEnum } from '@prisma/client';
import Joi from 'joi';

const schema = Joi.object({
    accompanyingPeople: Joi.number(),
    message: Joi.string().max(500),
    participantType: Joi.string().valid(
        ...Object.values(EventParticipantTypeEnum).filter(
            (type) => type !== EventParticipantTypeEnum.ORGANIZER
        )
    ),
    displayPhoneNumber: Joi.boolean(),
}).options({
    presence: 'required',
    allowUnknown: false,
});

export default function (form: any) {
    const { error } = schema.validate(form);
    return error;
}
