import Joi from 'joi';

export const createCustomerSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
});

export const addNewCardSchema = Joi.object({
    customer_id: Joi.string().required(),
    card_Name: Joi.string().required(),
    card_ExpYear: Joi.string().required(),
    card_ExpMonth: Joi.string().required(),
    card_Number: Joi.string().required(),
    card_CVC: Joi.string().required(),
});

export const createChargesSchema = Joi.object({
    receipt_email: Joi.string().required(),
    amount: Joi.string().required(),
    // currency: Joi.string().optional(),
    card: Joi.string().required(),
    customer: Joi.string().required(),
});
