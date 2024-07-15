import { Request, Response, NextFunction } from "express";
import userLicenseService from "../services/userLicense.service";

export const getUserLicense = async (req: any, res: Response, next: NextFunction) => {
    try {
        const userLicense = await userLicenseService.getAllUserLicenses();
        res.status(200).json(userLicense)
    } catch (err: unknown) {
        next(err)
    }
}

export const getUserLicenseById = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const userLicense = await userLicenseService.getUserLicenseById(id);
        res.status(200).json(userLicense)
    } catch (err: unknown) {
        next(err)
    }
}

export const addUserLicense = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const response = await userLicenseService.addUserLicense(req.body)
        res.status(200).json({ userLicense: response, error: false })
    } catch (error: unknown) {
        next(error);
    }

}

export const updateUserLicense = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const response = await userLicenseService.updateUserLicense(req.body)
        res.status(200).json({ userLicense: response, error: false })
    } catch (error: unknown) {
        next(error);
    }

}

export const deleteUserLicense = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { id } = req.params;
        const response = await userLicenseService.deleteUserLicense(id)
        res.status(200).json({ userLicense: response, error: false })
    } catch (error: unknown) {
        next(error);
    }

}