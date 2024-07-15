import Joi from 'joi';

export const ConversationSchema = Joi.object({
    senderId: Joi.string().required(),
    receiverId: Joi.string().optional(),
});