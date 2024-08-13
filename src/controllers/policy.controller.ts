import { Request, Response, NextFunction } from "express";
import policyService from "../services/policy.service";

export const getPolicy = async (req: any, res: Response, next: NextFunction) => {
    try {
        const policy = await policyService.getAllPolicies();
        res.status(200).json(policy)
    } catch (err: unknown) {
        next(err)
    }
}

export const getPolicyById = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const policy = await policyService.getPolicyById(id);
        res.status(200).json(policy)
    } catch (err: unknown) {
        next(err)
    }
}

export const addPolicy = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const response = await policyService.addPolicy(req.body)
        res.status(200).json({ policy: response, error: false })
    } catch (error: unknown) {
        next(error);
    }

}

export const updatePolicy = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const response = await policyService.updatePolicy(req.body)
        res.status(200).json({ policy: response, error: false })
    } catch (error: unknown) {
        next(error);
    }

}

export const deletePolicy = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { id } = req.params;
        const response = await policyService.deletePolicy(id)
        res.status(200).json({ policy: response, error: false })
    } catch (error: unknown) {
        next(error);
    }

}
