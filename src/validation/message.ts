import Joi from 'joi';

export const addMessageSchema = Joi.object({
    conversationId: Joi.string().required(),
    senderId: Joi.string().required(),
    receiverId: Joi.string().required(),
    text: Joi.string().required(),
    type: Joi.string().required(),
});
