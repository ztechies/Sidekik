const axios = require('axios');
import { Request, Response, NextFunction } from "express";
const paypal = require('paypal-rest-sdk');
const { STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY, GOCARDLESS_ACCESS_TOKEN, GOCASHLESS_API_KEY } = process.env;
const stripe = require('stripe')(STRIPE_SECRET_KEY)

const constants = require('gocardless-nodejs/constants');
const gocardless = require('gocardless-nodejs');
const gocardlessClient = gocardless(GOCARDLESS_ACCESS_TOKEN, constants.Environments.Sandbox);
const GOCASHLESS_API_URL = 'https://api.gocashless.com'

// Stripe payment gateway
export const createStripeCustomer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customer = await stripe.customers.create({
            name: req.body.name,
            email: req.body.email,
        });
        res.status(200).send(customer);
    } catch (err) {
        next(err);
    }
}

export const addNewCardToStripe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            customer_id,
            card_Name,
            card_ExpYear,
            card_ExpMonth,
            card_Number,
            card_CVC,
        } = req.body;

        const card_token = await stripe.tokens.create({
            card: {
                name: card_Name,
                number: card_Number,
                exp_year: card_ExpYear,
                exp_month: card_ExpMonth,
                cvc: card_CVC
            }
        });

        const card = await stripe.customers.createSource(customer_id, {
            source: `${card_token.id}`
        });

        res.status(200).send({ card: card.id });

    } catch (err) {
        next(err);
    }

}

export const createChargesToStripe = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const createCharge = await stripe.charges.create({
            receipt_email: 'tester@gmail.com',
            amount: parseInt(req.body.amount) * 100, //amount*100
            currency: 'INR',
            card: req.body.card_id,
            customer: req.body.customer_id
        });
        res.status(200).send(createCharge);

    } catch (err) {
        next(err);
    }

}

// Paypal payment gateway
export const payProductToPaypal = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": "http://localhost:3000/success",
                "cancel_url": "http://localhost:3000/cancel"
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": "Book",
                        "sku": "001",
                        "price": "25.00",
                        "currency": "USD",
                        "quantity": 1
                    }]
                },
                "amount": {
                    "currency": "USD",
                    "total": "25.00"
                },
                "description": "Hat for the best team ever"
            }]
        };

        paypal.payment.create(create_payment_json, function (error: any, payment: any) {
            if (error) {
                throw error;
            } else {
                for (let i = 0; i < payment.links.length; i++) {
                    if (payment.links[i].rel === 'approval_url') {
                        res.redirect(payment.links[i].href);
                    }
                }
            }
        });

    } catch (err) {
        next(err);
    }
}

export const successPageToPaypal = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payerId = req.query.PayerID;
        const paymentId = req.query.paymentId;

        const execute_payment_json = {
            "payer_id": payerId,
            "transactions": [{
                "amount": {
                    "currency": "USD",
                    "total": "25.00"
                }
            }]
        };

        paypal.payment.execute(paymentId, execute_payment_json, function (error: any, payment: any) {
            if (error) {
                console.log(error.response);
                throw error;
            } else {
                console.log(JSON.stringify(payment));
                res.render('success');
            }
        });
    } catch (err) {
        next(err);
    }

}

export const cancelPageToPaypal = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.render('cancel');
    } catch (err) {
        next(err);
    }
}


// Gocardless payment gateway
export const addPaymentToGocardless = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const listResponse = await gocardlessClient.customers.list();
        const customers = listResponse.customers;
        console.log(customers);
        const payment = await gocardlessClient.payments.create({
            amount: 100,
            currency: "GBP",
            charge_date: "2024-05-19",
            reference: "WINEBOX001",
            metadata: {
                order_dispatch_date: "2024-07-30"
            }
            ,
            links: {
                mandate: "MD0000123ABC"
            }
        });
        res.status(200).send(customers);

    } catch (err) {
        next(err);
    }
}

export const addSubscriptionToGocardless = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const subscription = await gocardlessClient.subscriptions.create({
            amount: "2500",
            currency: "GBP",
            name: "Monthly Magazine",
            interval_unit: "monthly",
            day_of_month: "1",
            // metadata": {
            //   order_no: "ABCD1234"
            // },
            links: {
                mandate: "MA123"
            }
        });

        res.status(200).send(subscription);

    } catch (err) {
        next(err);
    }
}
export const addScheduleToGocardless = async (req: Request, res: Response, next: NextFunction) => {
    const { customerId, amount, schedule } = req.body
    try {

        const response = await axios.post(
            `${GOCASHLESS_API_URL}/v1/payments/schedule`,
            {
                customer_id: customerId,
                amount: amount,
                schedule: schedule
            },
            {
                headers: {
                    // Authorization: `Basic ${GOCASHLESS_API_KEY}`
                    Authorization: "Basic dGVzdHNpZGVraWtAeW9wbWFpbC5jb206QzBhWXlPZG1OaU12Vkc="
                }
            }
        );
        return response.data;

    } catch (err) {
        next(err);
    }
}
module.exports = {
    createStripeCustomer,
    addNewCardToStripe,
    createChargesToStripe,
    payProductToPaypal,
    successPageToPaypal,
    cancelPageToPaypal,
    addPaymentToGocardless,
    addSubscriptionToGocardless,
    addScheduleToGocardless
}