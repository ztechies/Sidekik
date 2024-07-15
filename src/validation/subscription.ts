import Joi from 'joi';

export const addSubscriptionSchema = Joi.object({
    title: Joi.string().required(),
    duration: Joi.string().required(),
    discount: Joi.number().required(),
    promoCode: Joi.string().required(),
    noOfProjects: Joi.number().required(),
    dataSupport: Joi.string().required(),
    status: Joi.string().valid('active', 'inActive').default('inactive')
});

export const updateSubscriptionSchema = Joi.object({
    id: Joi.string().required(),
    title: Joi.string().required(),
    duration: Joi.string().required(),
    discount: Joi.number().required(),
    promoCode: Joi.string().required(),
    noOfProjects: Joi.number().required(),
    dataSupport: Joi.string().required(),
    status: Joi.string().valid('active', 'inActive').default('inactive')
});