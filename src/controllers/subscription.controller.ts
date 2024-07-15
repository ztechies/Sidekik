import { Request, Response, NextFunction } from "express";
import subscriptionService from "../services/subscription.service";

export const getSubscription = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const subscription = await subscriptionService.getAllSubscription();
        res.status(200).json(subscription)
    } catch (err: unknown) {
        next(err)
    }
}

export const getSubscriptionById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const subscription = await subscriptionService.getSubscriptionById(id);
        res.status(200).json(subscription)
    } catch (err: unknown) {
        next(err)
    }
}

export const addSubscription = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const response = await subscriptionService.addSubscription(req.body)
        res.status(200).json({ subscription: response, error: false })
    } catch (error: unknown) {
        next(error);
    }

}

export const updateSubscription = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const response = await subscriptionService.updateSubscription(req.body)
        res.status(200).json({ subscription: response, error: false })
    } catch (error: unknown) {
        next(error);
    }

}

export const deleteSubscription = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { id } = req.params;
        const response = await subscriptionService.deleteSubscription(id)
        res.status(200).json({ subscription: response, error: false })
    } catch (error: unknown) {
        next(error);
    }

}