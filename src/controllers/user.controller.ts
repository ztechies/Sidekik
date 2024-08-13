import { Request, Response, NextFunction } from "express";
import { getProfileStatusById } from '../services/user.service';

export const getProfileStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await getProfileStatusById(req.params.id)
        res.status(200).json({ response, error: false })
    } catch (error) {
        next(error);
    }
}
