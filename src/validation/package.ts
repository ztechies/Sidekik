import Joi from 'joi';

export const addPackageSchema = {
  body: Joi.object().keys({
    userId: Joi.string().required(),
    title: Joi.string().required(),
    subTitle: Joi.string().required(),
    serviceId: Joi.string().required(),
    packageType: Joi.string().valid('standard', 'custom').required(),
    price: Joi.number().required(),
    inclusions: Joi.string().required(),
    duration: Joi.string().required(),
    // description: Joi.string().required(),
    isPopular: Joi.boolean().required(),
    milestones: Joi.array().items(
      Joi.object().keys({
        name: Joi.string(), //.required(),
        description: Joi.string(), //.required(),
        percentage: Joi.number(), //.required(),
        when: Joi.string(), //.required(),
        completed: Joi.boolean().default(false),
        isDeleted: Joi.boolean().default(false)
      })
    )
  }),
};

export const updatePackageSchema = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
  body: Joi.object().keys({
    title: Joi.string(),
    subTitle: Joi.string(),
    serviceId: Joi.string(),
    packageType: Joi.string().valid('standard', 'custom'),
    price: Joi.number(),
    inclusions: Joi.string(),
    duration: Joi.string(),
    // description: Joi.string().required(),
    isPopular: Joi.boolean(),
    milestones: Joi.array().items(
      Joi.object().keys({
        name: Joi.string(), //.required(),
        description: Joi.string(), //.required(),
        percentage: Joi.number(), //.required(),
        when: Joi.string(), //.required(),
        completed: Joi.boolean().default(false),
        isDeleted: Joi.boolean().default(false)
      })
    )
  }),
};