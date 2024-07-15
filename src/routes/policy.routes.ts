import express, { Router } from 'express';
import { addPolicy, updatePolicy, getPolicy, deletePolicy, getPolicyById } from '../controllers/policy.controller';
import { validate } from '../middleware/validator';
import { addPolicySchema, updatePolicySchema } from '../validation/policy';
import { verifyToken } from '../middleware/verifyToken';

const policyRouter: Router = express.Router();

policyRouter.get('/', getPolicy)
policyRouter.get('/:id', getPolicyById)
policyRouter.post('/', validate(addPolicySchema), addPolicy)
policyRouter.patch('/', validate(updatePolicySchema), updatePolicy)
policyRouter.delete('/:id', deletePolicy)

export default policyRouter;
