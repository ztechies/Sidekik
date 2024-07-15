import express, { Router } from 'express';
import { validate } from '../middleware/validator';
import { ConversationSchema } from '../validation/conversation';
import { verifyToken } from '../middleware/verifyToken';
import { addConversation, getConversation } from '../controllers/conversation.controller';

const ConversationRouter: Router = express.Router();

ConversationRouter.post('/add', verifyToken, validate(ConversationSchema), addConversation);
ConversationRouter.post('/get', verifyToken, validate(ConversationSchema), getConversation);

export default ConversationRouter;
