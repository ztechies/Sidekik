import express, { Request, Response, NextFunction, Router } from 'express';
import authController from '../controllers/auth.controller';
import { validate } from '../middleware/validator';
import { registerUserSchema, registerGoogleUserSchema } from '../validation/registerUser';
import { verifyToken } from '../middleware/verifyToken';
import { forgotPasswordSchema } from '../validation/forgotPassword';

const RegisterRouter: Router = express.Router();

RegisterRouter.get('/verify-token/:token', authController.verifyToken)
RegisterRouter.get('/users', verifyToken, authController.getUsers);
RegisterRouter.get('/user/:id', verifyToken, authController.getUserById);
RegisterRouter.post('/register', validate(registerUserSchema), authController.registerUser);
RegisterRouter.post('/register-google-user', validate(registerGoogleUserSchema), authController.registerGoogleUser)
RegisterRouter.get('/verify-email/:token', authController.verifyEmail)
RegisterRouter.post('/login', authController.login);
RegisterRouter.post('/login-google-user', authController.loginGoogleUser)
RegisterRouter.post('/forgot-password', verifyToken, validate(forgotPasswordSchema), authController.forgotPassword)
RegisterRouter.post('/recoverPasswordLink', verifyToken, authController.generateRecoverPasswordLink)

export default RegisterRouter;