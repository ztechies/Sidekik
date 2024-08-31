const axios = require('axios');
import moment from "moment";
import { subscribe } from "diagnostics_channel";
import { Request, Response, NextFunction } from "express";
import User from "./../models/User";
import { nextTick } from "process";
const paypal = require('paypal-rest-sdk');
const { STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY, GOCARDLESS_ACCESS_TOKEN, GOCASHLESS_API_KEY } = process.env;
const stripe = require('stripe')(STRIPE_SECRET_KEY)

const constants = require('gocardless-nodejs/constants');
const gocardless = require('gocardless-nodejs');
const gocardlessClient = gocardless(GOCARDLESS_ACCESS_TOKEN, constants.Environments.Sandbox);
const GOCASHLESS_API_URL = 'https://api.gocashless.com'

// Stripe payment gateway

const stripeSession = async (plan: string) => {
    try {
        const session = await stripe.checkout.sessions.create({
            mode: "subscription",
            payment_method_types: ["card"],
            line_items: [
                {
                    price: plan,
                    quantity: 1
                },
            ],
            success_url: "http://localhost:5173/success",
            cancel_url: "http://localhost:5173/cancel"
        });
        return session;
    } catch (e) {
        return e;
    }
};

// check subscription checkout session

export const checkSubscriptionCheckoutSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { plan, email } = req.body;
        const session = await stripeSession(plan);
        const user = await User.findOne({ email });

        if (user) {
            console.log("user", user);
            // @ts-ignore
            user.subscription.sessionId = session.id;
            await user.save();
        }

        return res.json({ session });
    } catch (error) {
        next(error)
    }
}


export const paymentSuccess = async (req: Request, res: Response) => {
    try {
        const { sessionId, email } = req.body;
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === 'paid') {
            const subscriptionId = session.subscription;
            try {
                const subscription = await stripe.subscriptions.retrieve(subscriptionId);
                const user = await User.findOne({ email });

                if (user) {
                    const planId = subscription.plan.id;
                    const planType = subscription.plan.amount === 50000 ? "basic" : "pro";
                    const startDate = moment.unix(subscription.current_period_start).format('YYYY-MM-DD');
                    const endDate = moment.unix(subscription.current_period_end).format('YYYY-MM-DD');
                    const durationInSeconds = subscription.current_period_end - subscription.current_period_start;
                    const durationInDays = moment.duration(durationInSeconds, 'seconds').asDays();

                    // Ensure the subscription field exists
                    if (!user.subscription) {
                        throw new Error;
                    }

                    // Update user subscription details
                    user.subscription = {
                        sessionId: null,
                        planId,
                        planType,
                        planStartDate: startDate,
                        planEndDate: endDate,
                        planDuration: durationInDays
                    };

                    await user.save();

                    return res.json({ message: "Payment successful" });
                } else {
                    return res.status(404).json({ message: "User not found" });
                }
            } catch (error) {
                console.error('Error retrieving subscription:', error);
                return res.status(500).send(error);
            }
        } else {
            return res.json({ message: "Payment failed" });
        }
    } catch (error) {
        return res.status(500).send(error);
    }
};



// Create or retrieve a Stripe customer
export const createStripeCustomer = async (req: Request, res: Response) => {
    const { email, name } = req.body;

    try {
        // Check if the customer already exists
        let customer = await stripe.customers.list({ email, limit: 1 });
        if (customer.data.length === 0) {
            // Create new customer if not exists
            customer = await stripe.customers.create({
                email,
                name,
            });
        } else {
            customer = customer.data[0];
        }

        res.json({ id: customer.id });
    } catch (error) {
        res.status(500).send(error);
    }
};

// Attach a Payment Method to a Customer
export const addPaymentMethod = async (req: Request, res: Response) => {
    const { customerId, paymentMethodId } = req.body;

    try {
        await stripe.paymentMethods.attach(paymentMethodId, {
            customer: customerId,
        });

        await stripe.customers.update(customerId, {
            invoice_settings: {
                default_payment_method: paymentMethodId,
            },
        });

        res.json({ success: true });
    } catch (error) {
        res.status(500).send(error);
    }
};


// Create a Subscription
// export const createSubscriptionToStripe = async (req: Request, res: Response) => {
//     const { customerId, priceId } = req.body;

//     try {
//         const subscription = await stripe.subscriptions.create({
//             customer: customerId,
//             items: [{ price: priceId }],
//             expand: ['latest_invoice.payment_intent'],
//         });

//         res.json(subscription);
//     } catch (error) {
//         res.status(500).send(error);
//     }
// };

// export const createStripeCustomer = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { email, name } = req.body;
//         console.log("createStripeCustomer", req.body);


//         let customer;
//         // Check if the customer already exists
//         const customers = await stripe.customers.list({
//             email,
//             limit: 1
//         });

//         if (customers.data.length > 0) {
//             customer = customers.data[0];
//         } else {
//             // Create new customer
//             customer = await stripe.customers.create({
//                 name,
//                 email,
//             });
//         }
//         console.log("createStripeCustomer", createStripeCustomer);

//         res.status(200).json(customer);
//     } catch (err) {
//         next(err);
//     }
// }

export const addNewCardToStripe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token, customer_id } = req.body;
        console.log("addNewCardToStripe", req.body);

        // Attach the card token to the customer
        const card = await stripe.customers.createSource(customer_id, {
            source: token,
        });
        console.log("addNewCardToStripe", addNewCardToStripe);

        res.status(200).json({ card_id: card.id });

    } catch (err: any) {
        next(err);
    }
}

// export const addPaymentMethod = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { paymentMethodId, customerId } = req.body;
//         console.log("addPaymentMethod", req.body);

//         console.log("1234");

//         const resp = await stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });
//         console.log("5678");


//         console.log("phase 1", resp);


//         await stripe.customers.update(customerId, {
//             invoice_settings: {
//                 default_payment_method: paymentMethodId,
//             },
//         });
//         console.log("phase 2");
//         console.log("addPaymentMethod", addPaymentMethod);

//         res.status(200).json({ success: true });
//     } catch (err) {

//         next(err);
//     }
// }

export const createSubscriptionToStripe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { customerId, priceId } = req.body;
        const subscription = await stripe.subscriptions.create({
            customer: customerId,
            items: [{
                price: priceId,
            }],
            payment_behavior: 'default_incomplete',
            payment_settings: { save_default_payment_method: 'on_subscription' },
            expand: ['latest_invoice.payment_intent'],
        });

        res.send({
            subscriptionId: subscription.id,
            clientSecret: subscription.latest_invoice.payment_intent.client_secret,
        });
    } catch (error) {
        next(error);
    }
};

export const createPaymentIntent = async (req: Request, res: Response) => {
    try {
        const { amount, customerId } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'aud',
            customer: customerId,
            setup_future_usage: 'off_session',
        });

        res.status(200).json({
            clientSecret: paymentIntent.client_secret,
            id: paymentIntent.id,
        });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



// export const createSubscriptionToStripe = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { customerId, planId, paymentMethodId } = req.body;

//         console.log("createSubscriptionToStripe", req.body);

//         // Attach the payment method to the customer
//         await stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });

//         // Set the payment method as the default payment method
//         await stripe.customers.update(customerId, {
//             invoice_settings: {
//                 default_payment_method: paymentMethodId,
//             },
//         });

//         // Create the subscription
//         const subscription = await stripe.subscriptions.create({
//             customer: customerId,
//             items: [{ plan: planId }],
//             expand: ['latest_invoice.payment_intent'],
//         });

//         console.log("createSubscriptionToStripe", subscription);

//         res.status(200).json(subscription);
//     } catch (err) {
//         next(err);
//     }
// };
// export const createSubscriptionToStripe = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { customerId, planId, paymentMethodId } = req.body;

//         console.log("Request Body:", req.body);

//         // Attach the payment method to the customer
//         try {
//             await stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });
//         } catch (attachError) {
//             console.error("Error attaching payment method:", attachError);
//             // @ts-ignore
//             if (attachError.code === 'payment_method_previously_used') {
//                 return res.status(400).json({ error: 'Payment method was previously used or detached. Please use a different payment method.' });
//             }
//             throw attachError;
//         }

//         // Set the payment method as the default payment method
//         await stripe.customers.update(customerId, {
//             invoice_settings: {
//                 default_payment_method: paymentMethodId,
//             },
//         });

//         // Create the subscription
//         const subscription = await stripe.subscriptions.create({
//             customer: customerId,
//             items: [{ price: planId }], // Changed from 'plan' to 'price' for the latest Stripe API
//             expand: ['latest_invoice.payment_intent'],
//         });

//         console.log("Subscription created:", subscription);

//         res.status(200).json(subscription);
//     } catch (err) {
//         console.error("Error creating subscription:", err);
//         next(err);
//     }
// };



export const getProductsOfStripe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await stripe.products.list();
        const productsWithPrices = await Promise.all(products.data.map(async (product: any) => {
            if (product.default_price) {
                const price = await stripe.prices.retrieve(product.default_price);
                return {
                    ...product,
                    price: {
                        id: price.id,
                        currency: price.currency,
                        unit_amount: price.unit_amount,
                        type: price.type,
                        recurring: price.recurring,
                    }
                };
            } else {
                return product;
            }
        }));

        res.status(200).json(productsWithPrices);
    } catch (err) {
        next(err);
    }
}



export const createChargesToStripe = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const createCharge = await stripe.charges.create({
            receipt_email: req.body.receipt_email,
            amount: parseInt(req.body.amount) * 100,
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
    createPaymentIntent,
    createSubscriptionToStripe,
    addPaymentMethod,
    getProductsOfStripe,
    payProductToPaypal,
    successPageToPaypal,
    cancelPageToPaypal,
    addPaymentToGocardless,
    addSubscriptionToGocardless,
    addScheduleToGocardless,
    stripeSession,
    checkSubscriptionCheckoutSession,
    paymentSuccess
}