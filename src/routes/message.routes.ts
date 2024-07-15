import express, { Router } from 'express';
import { validate } from '../middleware/validator';
import { verifyToken } from '../middleware/verifyToken';
import { addMessage, getMessage, getUnreadMessage, readMessage } from '../controllers/message.controller';
import { addMessageSchema } from '../validation/message';

const MessageRouter: Router = express.Router();

MessageRouter.post('/add', verifyToken, validate(addMessageSchema), addMessage);
MessageRouter.get('/get/:id', verifyToken, getMessage);
MessageRouter.post('/read', verifyToken, readMessage);
MessageRouter.post('/unread-message', verifyToken, getUnreadMessage);

export default MessageRouter;