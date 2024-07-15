import express from 'express';
import RegisterRouter from './auth.routes';
import EmailRouter from './email.routes';
import SmsRouter from './sms.routes';
import policyRouter from './policy.routes';
import termsOfUseRouter from './termsOfUse.routes'
import userLicense from './userLicense.routes'
import ConversationRouter from './conversation.routes';
import MessageRouter from './message.routes';
import FileRouter from './file.routes';
import ActivePolicyRouter from './activePolicy.routes';
import SubscriptionRouter from './subscription.routes';

const router = express.Router();

router.use('/auth', RegisterRouter);
router.use('/email', EmailRouter);
router.use('/sms', SmsRouter);
router.use('/policy', policyRouter);
router.use('/terms-of-use', termsOfUseRouter);
router.use('/license', userLicense);
router.use('/conversation', ConversationRouter);
router.use('/active-policy', ActivePolicyRouter)
router.use('/message', MessageRouter);
router.use('/file', FileRouter);
router.use('/subscription', SubscriptionRouter)

export default router;