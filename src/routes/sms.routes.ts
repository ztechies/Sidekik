import express, { Router } from 'express';
import { addSms, updateSms, getSms, deleteSms, getSmsById } from '../controllers/sms.controller';
import { validate } from '../middleware/validator';
import { addSmsSchema, updateSmsSchema } from '../validation/sms';
import { verifyToken } from '../middleware/verifyToken';

const SmsRouter: Router = express.Router();

// SmsRouter.get('/', verifyToken, getSms)
// SmsRouter.get('/:id', verifyToken, getSmsById)
// SmsRouter.post('/', verifyToken, validate(addSmsSchema), addSms)
// SmsRouter.patch('/', verifyToken, validate(updateSmsSchema), updateSms)
// SmsRouter.delete('/:id', verifyToken, deleteSms)

SmsRouter.get('/', getSms)
SmsRouter.get('/:id', getSmsById)
SmsRouter.post('/', validate(addSmsSchema), addSms)
SmsRouter.patch('/', validate(updateSmsSchema), updateSms)
SmsRouter.delete('/:id', deleteSms)

export default SmsRouter;