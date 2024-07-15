import { Response, NextFunction } from "express";
import activePolicies from "../services/activePolicy.service";

export const getActivePolicy = async (req: any, res: Response, next: NextFunction) => {
    try {
        const activePolicy = await activePolicies.getActivePolicies();
        res.status(200).json(activePolicy)
    } catch (err: unknown) {
        next(err)
    }
}
