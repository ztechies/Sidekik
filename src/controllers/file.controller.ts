import { Request, Response, NextFunction } from "express";
import fileService from "../services/file.service";

export const getFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await fileService.getFile(req.params.filename, res);
    } catch (err: unknown) {
        console.error('Error in getFile:', err);
        next(err);
    }
}

export const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: true, message: 'File not provided' });
        }
        const response = await fileService.uploadFile(req.file.filename);
        res.status(200).json({ imageUrl: response, error: false });
    } catch (error: unknown) {
        console.error('Error in uploadFile:', error);
        next(error);
    }
}
