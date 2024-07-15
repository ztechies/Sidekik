import express, { Router } from 'express';
import { addSubscription, updateSubscription, getSubscription, deleteSubscription, getSubscriptionById } from '../controllers/subscription.controller';
import { validate } from '../middleware/validator';
import { addSubscriptionSchema, updateSubscriptionSchema } from '../validation/subscription';
import { verifyToken } from '../middleware/verifyToken';

const SubscriptionRouter: Router = express.Router();

// SubscriptionRouter.get('/', verifyToken, getEmail)
// SubscriptionRouter.get('/:id', verifyToken, getEmailById)
// SubscriptionRouter.post('/', verifyToken, validate(addEmailSchema), addEmail)
// SubscriptionRouter.patch('/', verifyToken, validate(updateEmailSchema), updateEmail)
// SubscriptionRouter.delete('/:id', verifyToken, deleteEmail)

SubscriptionRouter.get('/', getSubscription)
SubscriptionRouter.get('/:id', getSubscriptionById)
SubscriptionRouter.post('/', validate(addSubscriptionSchema), addSubscription)
SubscriptionRouter.patch('/', validate(updateSubscriptionSchema), updateSubscription)
SubscriptionRouter.delete('/:id', deleteSubscription)

export default SubscriptionRouter;