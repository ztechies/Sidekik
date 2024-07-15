import { Request, Response, NextFunction } from "express";
import smsService from "../services/sms.service";

export const getSms = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sms = await smsService.getAllSms();
        res.status(200).json(sms)
    } catch (err: unknown) {
        next(err)
    }
}

export const getSmsById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const email = await smsService.getSmsById(id);
        res.status(200).json(email)
    } catch (err: unknown) {
        next(err)
    }
}

export const addSms = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const response = await smsService.addSms(req.body)
        res.status(200).json({ sms: response, error: false })
    } catch (error: unknown) {
        next(error);
    }

}

export const updateSms = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const response = await smsService.updateSms(req.body)
        res.status(200).json({ sms: response, error: false })
    } catch (error: unknown) {
        next(error);
    }

}

export const deleteSms = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { id } = req.params;
        const response = await smsService.deleteSms(id)
        res.status(200).json({ sms: response, error: false })
    } catch (error: unknown) {
        next(error);
    }

}