import Joi from 'joi';

export const joiCreateEventObject = {
    name: Joi.string().min(5).max(50),
    date: Joi.date().greater('now').iso(),
    city: Joi.string().max(50),
    address: Joi.string().max(100),
    description: Joi.string().max(1000),
    // acceptCoOrganizer: Joi.boolean(),
};

const schema = Joi.object(joiCreateEventObject).options({
    presence: 'required',
    allowUnknown: false,
});

export default function (form: any) {
    const { error } = schema.validate(form);
    return error;
}
