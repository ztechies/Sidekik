import express, { Request, Response, NextFunction, Router } from 'express';
import authController from '../controllers/auth.controller';
import { verifyOtp, generateOtp } from '../controllers/user.controller';
import { validate } from '../middleware/validator';
import { registerUserSchema, registerGoogleUserSchema } from '../validation/registerUser';
import { verifyToken } from '../middleware/verifyToken';
import { forgotPasswordSchema } from '../validation/forgotPassword';
import { resetPasswordSchema } from '../validation/resetPassword';
import { getProfileStatus } from '../controllers/user.controller';

const authRouter: Router = express.Router();

authRouter.get('/verify-token/:token', authController.verifyToken)
authRouter.get('/users', verifyToken, authController.getUsers);
authRouter.get('/user/:id', verifyToken, authController.getUserById);
authRouter.get('/user/profile-status/:id', verifyToken, getProfileStatus);
authRouter.post('/register', validate(registerUserSchema), authController.registerUser);
authRouter.post('/register-google-user', validate(registerGoogleUserSchema), authController.registerGoogleUser)
authRouter.get('/verify-email/:token', authController.verifyEmail)
authRouter.get('/generate-otp/:id', generateOtp)
authRouter.get('/verify-otp/:id', verifyOtp)
authRouter.post('/login', authController.login);
authRouter.post('/check-username', authController.checkUsername)
authRouter.post('/login-google-user', authController.loginGoogleUser)
authRouter.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword)
authRouter.post('/recoverPasswordLink', authController.generateRecoverPasswordLink)
authRouter.post('/reset-password', verifyToken, validate(resetPasswordSchema), authController.resetPassword)

export default authRouter;