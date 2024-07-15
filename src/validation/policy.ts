import Joi from 'joi';

export const addPolicySchema = Joi.object({
    title: Joi.string().required(),
    template: Joi.string().required(),
    status: Joi.string().valid('active', 'inActive').default('inactive'),
});

export const updatePolicySchema = Joi.object({
    id: Joi.string().required(),
    template: Joi.string(),
    status: Joi.string().valid('active', 'inActive').default('inactive'),

});

