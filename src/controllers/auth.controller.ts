import { Request, Response, NextFunction } from "express";
import authService from '../services/auth.service';
import { CustomError } from '../middleware/errorHandler';
import sendResponse from "../utils/sendResponse";
import httpStatus from "http-status";

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.params.token;
        const response = await authService.verifyToken(token);
        res.status(200).json({ message: response, error: false });
    } catch (error) {
        next(error);
    }
}

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await authService.getUsers()
        res.status(200).json({ user: users, error: false })
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(404).json({ message: err.message })
        }
    }
}

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const user = await authService.getUserById(id);
        res.status(200).json({ user: user, error: false })
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(404).json({ message: err.message })
        }
    }
}

export const checkUsername = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userName } = req.body;
        const user = await authService.checkUserName(userName);
        res.status(200).json({ user, error: false });
    } catch (err: unknown) {
        next(err);
    }
}

const registerUser = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const response = await authService.registerUser(req.body)
        if (response) {
            return sendResponse(res, httpStatus.CREATED, response, "User Registered Successfully", true);
        }
    } catch (error: unknown) {
        next(error);
    }
}

const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.params.token;
        const response = await authService.verifyEmail(token)
        res.status(200).json({ response, error: false });
    } catch (error) {
        next(error);
    }
}

const registerGoogleUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await authService.registerGoogleUser(req.body)
        res.status(200).json({ token: response, error: false })
    } catch (error: unknown) {
        next(error);
    }
}

const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await authService.loginUser(req.body)
        res.status(200).json({ token: response?.jwtToken, userId: response?.userId, isVerify: response?.emailVerify, error: false })
    } catch (error) {
        next(error)
    }
}

const loginGoogleUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await authService.loginGoogleUser(req.body)
        res.status(200).json({ token: response, error: false })
    } catch (error) {
        next(error)
    }
}

const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await authService.forgotPassword(req.body)

        res.status(200).json({ response, error: false })

    } catch (error) {
        next(error);
    }
}

const generateRecoverPasswordLink = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const response = await authService.generateRecoverPasswordLink(req.body)
        res.status(200).json({ response, error: false })

    } catch (error) {
        next(error);
    }
}

const resetPassword = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const response = await authService.resetPassword(req.body)
        res.status(200).json({ response, error: false })

    } catch (error) {
        next(error);
    }
}

export default { login, forgotPassword, registerUser, getUsers, generateRecoverPasswordLink, getUserById, checkUsername, registerGoogleUser, loginGoogleUser, verifyEmail, verifyToken, resetPassword }