import Joi from 'joi';

const schema = Joi.object({
    name: Joi.string().min(2).max(30),
    description: Joi.string().min(0).max(1000),
    displayEmail: Joi.boolean(),
    displayPhoneNumber: Joi.boolean(),
    displayBirthDate: Joi.boolean(),
    isPublic: Joi.boolean(),
    phoneNumber: Joi.string().max(50),
    birthDate: Joi.date().less('now'),
    deletePicture: Joi.boolean().invalid(false),
})
    .options({
        allowUnknown: false,
    })
    .min(1);

export default function (form: any) {
    const { error } = schema.validate(form);
    return error;
}
