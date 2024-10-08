import express from 'express';
import AuthRouter from './auth.routes';
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
import ServiceRouter from './service.routes';
import PackageRouter from './package.routes';
import userPortfolio from './userPortfolio.routes';
import ProfileRouter from './profile.routes';
import PaymentRouter from './payment.routes';
// import uploadRouter from './upload.routes';
const router = express.Router();

// router.use('/auth', AuthRouter);
// router.use('/email', EmailRouter);
// router.use('/sms', SmsRouter);
// router.use('/policy', policyRouter);
// router.use('/terms-of-use', termsOfUseRouter);
// router.use('/license', userLicense);
// router.use('/conversation', ConversationRouter);
// router.use('/active-policy', ActivePolicyRouter)
// router.use('/message', MessageRouter);
// router.use('/file', FileRouter);
// router.use('/subscription', SubscriptionRouter);
// router.use('/service', ServiceRouter);
// router.use('/package', PackageRouter)
// router.use('/user-portfolio',userPortfolio)
// router.use('/profile', ProfileRouter)
// router.use('/payment', PaymentRouter)

const defaultRoutes = [
    { path: '/auth', route: AuthRouter },
    { path: '/email', route: EmailRouter },
    { path: '/sms', route: SmsRouter },
    { path: '/policy', route: policyRouter },
    { path: '/terms-of-use', route: termsOfUseRouter },
    { path: '/license', route: userLicense },
    { path: '/conversation', route: ConversationRouter },
    { path: '/active-policy', route: ActivePolicyRouter },
    { path: '/message', route: MessageRouter },
    { path: '/file', route: FileRouter },
    { path: '/subscription', route: SubscriptionRouter },
    { path: '/service', route: ServiceRouter },
    { path: '/package', route: PackageRouter },
    { path: '/user-portfolio', route: userPortfolio },
    { path: '/profile', route: ProfileRouter },
    { path: '/payment', route: PaymentRouter },
    // { path: '/upload', route: uploadRouter },
];

// Registering routes
defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });

export default router;