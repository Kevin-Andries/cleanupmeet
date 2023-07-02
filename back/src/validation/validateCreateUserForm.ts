import Joi from 'joi';

const schema = Joi.object({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email(),
    password: Joi.string().min(6).max(255),
}).options({ presence: 'required', allowUnknown: false });

export default function (form: any) {
    const { error } = schema.validate(form);
    return error;
}
