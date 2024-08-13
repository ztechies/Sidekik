import Joi from 'joi';

export const addServiceSchema = Joi.object({
    title: Joi.string().required(),
    isVerified: Joi.boolean().default(false)
});

export const updateServiceSchema = Joi.object({
    id: Joi.string().required(),
    title: Joi.string(),
    // userId: Joi.string().optional(),
    isVerified: Joi.boolean().optional(),
    isDeleted: Joi.boolean().optional()
});