import Joi from 'joi';

const schema = Joi.object({
    comment: Joi.string().min(1).max(500),
}).options({
    presence: 'required',
    allowUnknown: false,
});

export default function (form: any) {
    const { error } = schema.validate(form);
    return error;
}
