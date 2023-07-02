import Joi from 'joi';
import { joiCreateEventObject } from './validateCreateEventForm';

const schema = Joi.object({
    ...joiCreateEventObject,
    deletePicture: Joi.boolean().invalid(false),
}).options({
    allowUnknown: false,
});

export default function (form: any) {
    const { error } = schema.validate(form);
    return error;
}
