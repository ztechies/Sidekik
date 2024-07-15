import { Request, Response, NextFunction } from "express";
import termsOfUseService from "../services/termsOfUse.service";

export const getTermsOfUse = async (req: any, res: Response, next: NextFunction) => {
    try {
        const termsOfUse = await termsOfUseService.getAllTermsOfUses();
        res.status(200).json(termsOfUse)
    } catch (err: unknown) {
        next(err)
    }
}

export const getTermsOfUseById = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const termsOfUse = await termsOfUseService.getTermsOfUseById(id);
        res.status(200).json(termsOfUse)
    } catch (err: unknown) {
        next(err)
    }
}

export const addTermsOfUse = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const response = await termsOfUseService.addTermsOfUse(req.body)
        res.status(200).json({ termsOfUse: response, error: false })
    } catch (error: unknown) {
        next(error);
    }

}

export const updateTermsOfUse = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const response = await termsOfUseService.updateTermsOfUse(req.body)
        res.status(200).json({ termsOfUse: response, error: false })
    } catch (error: unknown) {
        next(error);
    }

}

export const deleteTermsOfUse = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { id } = req.params;
        const response = await termsOfUseService.deleteTermsOfUse(id)
        res.status(200).json({ termsOfUse: response, error: false })
    } catch (error: unknown) {
        next(error);
    }
}
