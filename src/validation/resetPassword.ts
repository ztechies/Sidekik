import Joi from 'joi';

export const resetPasswordSchema = Joi.object({
    userId: Joi.string(),
    oldPassword: Joi.string().min(8).required(),
    newPassword: Joi.string().min(8).required()
});