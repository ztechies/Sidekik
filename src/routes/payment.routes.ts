import { Router } from 'express';
import {
    createStripeCustomer,
    addNewCardToStripe,
    createChargesToStripe,
    payProductToPaypal,
    successPageToPaypal,
    cancelPageToPaypal,
    addPaymentToGocardless,
    addSubscriptionToGocardless,
    addScheduleToGocardless,
    createSubscriptionToStripe,
    getProductsOfStripe,
    addPaymentMethod,
    createPaymentIntent,
    checkSubscriptionCheckoutSession,
    paymentSuccess
} from '../controllers/payment.controller';
import { validate } from '../middleware/validator';
import { createCustomerSchema, addNewCardSchema, createChargesSchema } from '../validation/payment';
import { verifyToken } from '../middleware/verifyToken';

const PaymentRouter: Router = Router();

// Stripe payment gateway  
PaymentRouter.post('/stripe/create-subscription-checkout-session',checkSubscriptionCheckoutSession)
PaymentRouter.post('/stripe/payment-success', paymentSuccess)
PaymentRouter.post('/stripe/create-customer', validate(createCustomerSchema), createStripeCustomer);
PaymentRouter.post('/stripe/add-card', addNewCardToStripe);
PaymentRouter.post('/stripe/create-charges', validate(createChargesSchema), createChargesToStripe);
PaymentRouter.post('/stripe/create-subscription', createSubscriptionToStripe);
PaymentRouter.post('/stripe/attach-payment-method', addPaymentMethod);
PaymentRouter.post('/stripe/create-payment-intent', createPaymentIntent)
PaymentRouter.get('/stripe/get-products', getProductsOfStripe);

// PayPal payment gateway
PaymentRouter.post('/paypal/pay', payProductToPaypal);
PaymentRouter.post('/paypal/success', successPageToPaypal);
PaymentRouter.post('/paypal/cancel', cancelPageToPaypal);

// GoCardless payment gateway
PaymentRouter.post('/gocardless/payment', addPaymentToGocardless);
PaymentRouter.post('/gocardless/subscription', addSubscriptionToGocardless);
PaymentRouter.post('/gocardless/schedule', addScheduleToGocardless); // Uncomment if needed

export default PaymentRouter;
