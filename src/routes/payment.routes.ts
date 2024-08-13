import { Router } from 'express';
import { createStripeCustomer, addNewCardToStripe, createChargesToStripe, payProductToPaypal, successPageToPaypal, cancelPageToPaypal, addPaymentToGocardless, addSubscriptionToGocardless, addScheduleToGocardless } from '../controllers/payment.controller';
import { validate } from '../middleware/validator';
import { createCustomerSchema, addNewCardSchema, createChargesSchema  } from '../validation/payment';
import { verifyToken } from '../middleware/verifyToken';

const PaymentRouter: Router = Router();

// Stripe payment gateway
PaymentRouter.post('stripe/create-customer',validate(createCustomerSchema), createStripeCustomer)
PaymentRouter.post('stripe/add-card', validate(addNewCardSchema), addNewCardToStripe)
PaymentRouter.post('stripe/create-charges', validate(createChargesSchema), createChargesToStripe)

// Paypal payment gateway
PaymentRouter.post('paypal/pay', payProductToPaypal)
PaymentRouter.post('paypal/success', successPageToPaypal)
PaymentRouter.post('paypal/cancel', cancelPageToPaypal)

// GoCardless payment gateway
PaymentRouter.post('/gocardless/payment', addPaymentToGocardless)
PaymentRouter.post('/gocardless/subscription', addSubscriptionToGocardless)
// PaymentRouter.post('/gocardless/schedule', addScheduleToGocardless)


export default PaymentRouter;