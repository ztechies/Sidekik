import Joi from 'joi';

export const forgotPasswordSchema = Joi.object({
    newPassword: Joi.string().min(8).required(),
    token: Joi.string().required()
});