import dotenv from 'dotenv';
dotenv.config();

const MONGO_URL: string = process.env.MONGO_URL ? process.env.MONGO_URL : "";
const PORT: number = process.env.PORT ? Number(process.env.PORT) : 1337;
const SECRET_KEY: string = process.env.JWT_SECRET ? process.env.JWT_SECRET : "";
const SENDGRID_API_KEY: string = process.env.SENDGRID_API_KEY ? process.env.SENDGRID_API_KEY : "";
const EMAIL_FROM: string = process.env.EMAIL_FROM ? process.env.EMAIL_FROM : "";
const FRONTEND_URL: string = process.env.FRONTEND_URL ? process.env.FRONTEND_URL : "";

export const config = {
  mongo: {
    url: MONGO_URL
  },
  server: {
    port: PORT
  },
  jwt: {
    secretKey: SECRET_KEY
  },
  sendGrid: {
    apiKey: SENDGRID_API_KEY,
    emailFrom: EMAIL_FROM
  },
  frontEndUrl: {
    url: FRONTEND_URL
  }
};
