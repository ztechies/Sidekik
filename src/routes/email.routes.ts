import express, { Router } from 'express';
import { addEmail, updateEmail, getEmail, deleteEmail, getEmailById } from '../controllers/email.controller';
import { validate } from '../middleware/validator';
import { addEmailSchema, updateEmailSchema } from '../validation/email';
import { verifyToken } from '../middleware/verifyToken';

const EmailRouter: Router = express.Router();

// EmailRouter.get('/', verifyToken, getEmail)
// EmailRouter.get('/:id', verifyToken, getEmailById)
// EmailRouter.post('/', verifyToken, validate(addEmailSchema), addEmail)
// EmailRouter.patch('/', verifyToken, validate(updateEmailSchema), updateEmail)
// EmailRouter.delete('/:id', verifyToken, deleteEmail)

EmailRouter.get('/', getEmail)
EmailRouter.get('/:id', getEmailById)
EmailRouter.post('/', validate(addEmailSchema), addEmail)
EmailRouter.patch('/', validate(updateEmailSchema), updateEmail)
EmailRouter.delete('/:id', deleteEmail)

export default EmailRouter;
