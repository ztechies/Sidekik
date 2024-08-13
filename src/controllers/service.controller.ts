import { Request, Response, NextFunction } from "express";
import serviceService from "../services/service.service";

export const getService = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // @ts-ignore
        const { role } = req.user
        const service = await serviceService.getAllService(role);
        res.status(200).json({ service, error: false })
    } catch (err: unknown) {
        next(err)
    }
}

export const getServiceById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const service = await serviceService.getServiceById(id);
        res.status(200).json({ service, error: false })
    } catch (err: unknown) {
        next(err)
    }
}

export const addService = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const response = await serviceService.addService(req.body)
        res.status(200).json({ service: response, error: false })
    } catch (error: unknown) {
        next(error);
    }

}

export const updateService = async (req: Request, res: Response, next: NextFunction) => {

    try {
        // @ts-ignore
        const { role } = req.user
        if (role !== 'admin') return res.status(403).json({ message: "Only admin can update", error: true })
        const response = await serviceService.updateService(req.body)
        res.status(200).json({ service: response, error: false })
    } catch (error: unknown) {
        next(error);
    }

}

export const deleteService = async (req: Request, res: Response, next: NextFunction) => {

    try {
        // @ts-ignore
        const { role } = req.user
        if (role !== 'admin') return res.status(403).json({ message: "Only admin can delete", error: true })
        const { id } = req.params;
        const response = await serviceService.deleteService(id)
        res.status(200).json({ service: response, error: false })
    } catch (error: unknown) {
        next(error);
    }

}