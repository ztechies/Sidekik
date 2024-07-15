import { Request, Response, NextFunction } from "express";
import conversationService from "../services/conversation.service";

export const getConversation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const conversation = await conversationService.getConversation(req.body);
        res.status(200).json(conversation)
    } catch (error) {
        next(error)
    }
}

export const addConversation = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const response = await conversationService.addConversation(req.body)
        res.status(200).json({ conversation: response, error: false })
    } catch (error) {
        next(error);
    }

}