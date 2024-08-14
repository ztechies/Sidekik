import Joi from 'joi';

const countrySchema = Joi.object({
    id: Joi.number().required(),
    name: Joi.string().required(),
    code: Joi.string().length(2).required() // Assuming country code is always 2 characters long
});

export const addProfileSchema = {
    body: Joi.object().keys({
        userId: Joi.string().required(),
        profileImage: Joi.string().optional(),
        firstName: Joi.string().optional(),
        lastName: Joi.string().optional(),
        mobile: Joi.string().optional(),
        country: Joi.string().optional(),
        city: Joi.string().optional(),
        languages: Joi.array().items(Joi.string()).optional(),
        socialLinks: Joi.array().items(Joi.object({
            platform: Joi.string().valid('Facebook', 'Twitter', 'Instagram', 'LinkedIn', 'Other').required(),
            url: Joi.string().uri().required()
        })).optional(),
    }),
};
export const updateProfileSchema = {
    params: Joi.object().keys({
        userId: Joi.string().required(),
    }),
    body: Joi.object()
        .keys({
            profileImage: Joi.string().optional(),
            firstName: Joi.string().optional(),
            lastName: Joi.string().optional(),
            mobile: Joi.string().optional(),
            userName: Joi.string().optional(),
            country: Joi.object({
                id: Joi.number().required(),
                code: Joi.string().required(),
                name: Joi.string().required()
            }).optional(),
            state: Joi.object({
                id: Joi.number().required(),
                code: Joi.string().required(),
                name: Joi.string().required()
            }).optional(),
            city: Joi.object({
                id: Joi.number().required(),
                name: Joi.string().required()
            }).optional(),
            languages: Joi.array().items(Joi.string()).optional(),
            business: Joi.object({
                businessName: Joi.string().optional(),
                countryOfIncorporation: Joi.string().optional(),
                registrationNumber: Joi.string().optional(),
                address: Joi.string().optional(),
            }).optional(),
            socialLinks: Joi.array().items(Joi.object({
                platform: Joi.string().valid('Facebook', 'Twitter', 'Instagram', 'LinkedIn', 'Other').required(),
                url: Joi.string().uri().required()
            })).optional(),
            usePlatformAs: Joi.string().valid('business', 'individual').optional(),
            shortIntro: Joi.string().optional(),
            longIntro: Joi.string().optional(),
            primaryService: Joi.array().items(Joi.string()).optional(),
            otherService: Joi.array().items(Joi.string()).optional(),
            clientCountries: Joi.array().items(countrySchema).optional(),
        })
        .min(1),
};
