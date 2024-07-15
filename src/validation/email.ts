import Joi from 'joi';

export const addEmailSchema = Joi.object({
    title: Joi.string().required(),
    template: Joi.string().required(),
});

export const updateEmailSchema = Joi.object({
    id: Joi.string().required(),
    template: Joi.string().required(),
});

