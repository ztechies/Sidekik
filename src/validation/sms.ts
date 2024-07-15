import Joi from 'joi';

export const addSmsSchema = Joi.object({
    title: Joi.string().required(),
    template: Joi.string().required(),
});

export const updateSmsSchema = Joi.object({
    id: Joi.string().required(),
    template: Joi.string().required(),
});