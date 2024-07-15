import { Request, Response, NextFunction } from "express";
import messageService from "../services/message.service";

export const getMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const messages = await messageService.getMessage(req.params.id);
        res.status(200).json(messages)
    } catch (err: unknown) {
        next(err)
    }
}

export const addMessage = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const response = await messageService.addMessage(req.body)
        res.status(200).json({ message: response, error: false })
    } catch (error: unknown) {
        next(error);
    }

}

export const readMessage = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const response = await messageService.readMessage(req.body)
        res.status(200).json({ message: response, error: false })
    } catch (error: unknown) {
        next(error);
    }

}

export const getUnreadMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const count = await messageService.getUnreadMessage(req.body);
        res.status(200).json({ count: count })
    } catch (err: unknown) {
        next(err)
    }
}