import Joi from 'joi';

export const registerUserSchema = Joi.object({
    userName: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().max(50).required(),
    password: Joi.string().min(8).required(),
    role: Joi.string().valid('user', 'admin', 'client').default('user'),
    firstName: Joi.string().min(2).max(100).required(),
    lastName: Joi.string().min(2).max(100).required(),
    security: Joi.object().required(),
    registrationType: Joi.string().valid('form').required()
});

export const registerGoogleUserSchema = Joi.object({
    userName: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().max(50).required(),
    role: Joi.string().valid('user', 'admin', 'client').default('user'),
    firstName: Joi.string().min(2).max(100).required(),
    lastName: Joi.string().min(2).max(100).optional(),
    security: Joi.object().required(),
    registrationType: Joi.string().valid('google').required(),
    googleId: Joi.string().required()
});