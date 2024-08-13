import jwt from "jsonwebtoken"
import { config } from "../config/config";
import { CustomError } from "./errorHandler";

export function verifyToken(req: any, res: any, next: any) {

    const barrerToken = req.headers['authorization'];

    //  return res.status(401).send();
    if (!barrerToken) { throw new CustomError('Unauthorized access', 401); }

    const token = barrerToken.split(" ")[1];



    jwt.verify(token, config.jwt.secretKey, (err: any, decoded: any) => {
        if (err) return res.status(403).send('Invalid token');
        req.user = decoded;
        next();
    });
}

