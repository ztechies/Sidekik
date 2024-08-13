import { Request, Response, NextFunction } from "express";
import packageService from "../services/package.service";

export const getPackage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const packages = await packageService.getAllPackage();
        res.status(200).json({ package: packages, error: false })
    } catch (err: unknown) {
        next(err)
    }
}

export const getPackageById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const packages = await packageService.getPackageById(id);
        res.status(200).json({ package: packages, error: false })
    } catch (err: unknown) {
        next(err)
    }
}

export const addPackage = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const response = await packageService.addPackage(req.body)
        res.status(200).json({ package: response, error: false })
    } catch (error: unknown) {
        next(error);
    }

}

export const updatePackage = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const response = await packageService.updatePackage(req.params.id, req.body)
        res.status(200).json({ package: response, error: false })
    } catch (error: unknown) {
        next(error);
    }

}

export const deletePackage = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { id } = req.params;
        const response = await packageService.deletePackage(id)
        res.status(200).json({ package: response, error: false })
    } catch (error: unknown) {
        next(error);
    }

}