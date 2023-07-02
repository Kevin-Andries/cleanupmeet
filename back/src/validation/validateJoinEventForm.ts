import Joi from 'joi';

const schema = Joi.object({
    accompanyingPeople: Joi.number().required(),
}).options({
    allowUnknown: false,
});

export default function (form: any) {
    const { error } = schema.validate(form);
    return error;
}
