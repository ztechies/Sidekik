import Joi from 'joi';

export const addTermsOfUseSchema = Joi.object({
    title: Joi.string().required(),
    template: Joi.string().required(),
    status: Joi.string().valid('active', 'inActive').default('inactive'),
});

export const updateTermsOfUseSchema = Joi.object({
    id: Joi.string().required(),
    template: Joi.string(),
    status: Joi.string().valid('active', 'inActive').default('inactive'),

});