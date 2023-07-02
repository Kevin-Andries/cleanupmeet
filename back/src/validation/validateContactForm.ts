import Joi from 'joi';

const schema = Joi.object({
    message: Joi.string().max(1000).required(),
    email: Joi.string().email(),
}).options({
    allowUnknown: false,
});

export default function (form: any) {
    const { error } = schema.validate(form);
    return error;
}
