import { Request, Response, NextFunction } from "express";
import { getProfileStatusById, updateUserOtp, verifyUserOtp } from '../services/user.service';
import generateRandomNumber from "../utils/generateRandomNumber";
import sendResponse from "../utils/sendResponse";
import httpStatus from "http-status";

export const getProfileStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await getProfileStatusById(req.params.id)
        res.status(200).json({ response, error: false })
    } catch (error) {
        next(error);
    }
}

export const generateOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const otp = generateRandomNumber(6)
        const response = await updateUserOtp(id, otp, new Date(Date.now() + 10 * 60000)) // 10 minutes
        return sendResponse(res, httpStatus.NO_CONTENT, null, "OTP sent to registered email", true);
    } catch (error) {
        next(error);
    }
}
export const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if(req.params.id && req.query.otp){
            // @ts-ignore
            const response = await verifyUserOtp(req.params.id, req.query.otp)
            if(!response) return sendResponse(res, httpStatus.NOT_ACCEPTABLE, null, "OTP is not valid or expired", true);
            else return sendResponse(res, httpStatus.OK, response, "OTP is verified", true)
        }
    } catch (error) {
        next(error);
    }
}