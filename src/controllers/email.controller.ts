import { Request, Response, NextFunction } from "express";
import emailService from "../services/email.service";

export const getEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const email = await emailService.getAllEmails();
        res.status(200).json(email)
    } catch (err: unknown) {
        next(err)
    }
}

export const getEmailById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const email = await emailService.getEmailById(id);
        res.status(200).json(email)
    } catch (err: unknown) {
        next(err)
    }
}

export const addEmail = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const response = await emailService.addEmail(req.body)
        res.status(200).json({ email: response, error: false })
    } catch (error: unknown) {
        next(error);
    }

}

export const updateEmail = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const response = await emailService.updateEmail(req.body)
        res.status(200).json({ email: response, error: false })
    } catch (error: unknown) {
        next(error);
    }

}

export const deleteEmail = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { id } = req.params;
        const response = await emailService.deleteEmail(id)
        res.status(200).json({ email: response, error: false })
    } catch (error: unknown) {
        next(error);
    }

}
