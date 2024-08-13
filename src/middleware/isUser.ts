import { CustomError } from "./errorHandler";
import User from "../models/User";

export async function isUser(req: any, res: any, next: any) {
    
    try {
        if (req.user.role === 'user') {
            next();
        } else {
            next(new CustomError("Unauthorized, Role must be a user", 403));
        }
    } catch (err:any) {
        next(err)
    }
}
