import { Request, Response, NextFunction } from "express";
import userPortfolioService from "../services/userPortfolio.service";

export const getAllUserPortfolios = async (req: any, res: Response, next: NextFunction) => {
    try {
        const userPortfolio = await userPortfolioService.getAllUserPortfolios();
        res.status(200).json({ userPortfolio, error: false })
    } catch (err: unknown) {
        next(err)
    }
}

export const getUserPortfolioById = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const userPortfolio = await userPortfolioService.getUserPortfolioById(id);
        res.status(200).json({ userPortfolio, error: false })
    } catch (err: unknown) {
        next(err)
    }
}

export const getPortfolioByProfileId = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { profileId } = req.params;
        const response = await userPortfolioService.getPortfolioByProfileId(profileId)
        res.status(200).json({ userPortfolio: response, error: false })
    } catch (error: unknown) {
        next(error);
    }

}

export const addUserPortfolio = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const response = await userPortfolioService.addUserPortfolio(req.body)
        res.status(200).json({ userPortfolio: response, error: false })
    } catch (error: unknown) {
        next(error);
    }

}

export const updateUserPortfolio = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { profileId } = req.params;
        const response = await userPortfolioService.updateUserPortfolio(req.body, profileId)
        res.status(200).json({ userPortfolio: response, error: false })
    } catch (error: unknown) {
        next(error);
    }

}

export const deleteUserPortfolio = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { id } = req.params;
        const response = await userPortfolioService.deleteUserPortfolio(id)
        res.status(200).json({ userPortfolio: response, error: false })
    } catch (error: unknown) {
        next(error);
    }

}