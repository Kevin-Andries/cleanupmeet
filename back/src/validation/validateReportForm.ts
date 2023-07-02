import Joi from 'joi';

const schema = Joi.object({
    reportedUserId: Joi.string(),
    eventId: Joi.string(),
    message: Joi.string().max(500),
}).options({
    allowUnknown: false,
});

export default function (form: any) {
    const { error } = schema.validate(form);
    return error;
}
