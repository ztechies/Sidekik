import express, { Router } from 'express';
import { addPackage, updatePackage, getPackage, deletePackage, getPackageById } from '../controllers/package.controller';
// import { validate } from '../middleware/validator'; 
import validate from '../middleware/validate'; 

import { addPackageSchema, updatePackageSchema } from '../validation/package';
import { verifyToken } from '../middleware/verifyToken';

const router: Router = express.Router();

// PackageRouter.get('/', verifyToken, getSms)
// PackageRouter.get('/:id', verifyToken, getSmsById)
// PackageRouter.post('/', verifyToken, validate(addSmsSchema), addSms)
// PackageRouter.patch('/', verifyToken, validate(updateSmsSchema), updateSms)
// PackageRouter.delete('/:id', verifyToken, deleteSms)

router
    .route('/')
    .get(getPackage)
    .post(verifyToken, validate(addPackageSchema), addPackage)
router
    .route('/:id')
    .get(getPackageById)
    .patch(verifyToken, validate(updatePackageSchema), updatePackage)
    .delete(verifyToken, deletePackage)

export default router;