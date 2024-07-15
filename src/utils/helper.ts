import jwt from 'jsonwebtoken'
import { config } from '../config/config';
import sgmail from '@sendgrid/mail'

export const generateToken = async (payload: object, expiryTime:string) => {
    try {
        return jwt.sign(payload, config.jwt.secretKey,{ expiresIn: expiryTime });

    } catch (error) {
        throw error
    }
}

export function randomString(len: number, charSet: string) {
    charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';
    for (var i = 0; i < len; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz, randomPoz + 1);
    }
    return randomString;
}

export const sendEmail  = async (options:any) => {
    sgmail.setApiKey(config.sendGrid.apiKey)

    return await sgmail.send(options);
}