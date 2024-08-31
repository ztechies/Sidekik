import Joi from 'joi';

export const addUserPortfolioSchema = Joi.object({
    materialType: Joi.string().valid('Website', 'Video', 'Image', 'Press Release', 'Other').required(),
    materialTypeName: Joi.string().required(),
    customMaterialType: Joi.string().allow(``).optional(),
    files: Joi.array().items(Joi.string().allow(``)).optional(),
    links: Joi.array().items(Joi.string().allow(``)).optional()
});

export const updateUserPortfolioSchema = Joi.object({
    materialType: Joi.string().valid('Website', 'Video', 'Image', 'Press Release', 'Other').optional(),
    materialTypeName: Joi.string().optional(),
    customMaterialType: Joi.string().allow(``).optional(),
    files: Joi.array().items(Joi.string().allow(``)).optional(),
    links: Joi.array().items(Joi.string().allow(``)).optional()
});
