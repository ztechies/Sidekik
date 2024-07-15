import express, { Router } from 'express';
import { addTermsOfUse, updateTermsOfUse, getTermsOfUse, deleteTermsOfUse, getTermsOfUseById } from '../controllers/termsOfUse.controller';
import { validate } from '../middleware/validator';
import { addTermsOfUseSchema, updateTermsOfUseSchema } from '../validation/termsOfUse';
import { verifyToken } from '../middleware/verifyToken';

const termsOfUseRouter: Router = express.Router();

termsOfUseRouter.get('/', getTermsOfUse)
termsOfUseRouter.get('/:id', getTermsOfUseById)
termsOfUseRouter.post('/', validate(addTermsOfUseSchema), addTermsOfUse)
termsOfUseRouter.patch('/', validate(updateTermsOfUseSchema), updateTermsOfUse)
termsOfUseRouter.delete('/:id', deleteTermsOfUse)

export default termsOfUseRouter;