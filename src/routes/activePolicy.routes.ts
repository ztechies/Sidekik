import express, { Router } from 'express';
import { verifyToken } from '../middleware/verifyToken';
import { getActivePolicy } from '../controllers/activePolicy.controller';

const ActivePolicyRouter: Router = express.Router();

ActivePolicyRouter.get('/', getActivePolicy)

export default ActivePolicyRouter;
