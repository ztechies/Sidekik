import express, { Router } from 'express';
import { addUserLicense, updateUserLicense, getUserLicense, deleteUserLicense, getUserLicenseById } from '../controllers/userLicense.controller';
import { validate } from '../middleware/validator';
import { addUserLicenseSchema, updateUserLicenseSchema } from '../validation/userLicense';
import { verifyToken } from '../middleware/verifyToken';

const userLicense: Router = express.Router();

userLicense.get('/', getUserLicense)
userLicense.get('/:id', getUserLicenseById)
userLicense.post('/', validate(addUserLicenseSchema), addUserLicense)
userLicense.patch('/', validate(updateUserLicenseSchema), updateUserLicense)
userLicense.delete('/:id', deleteUserLicense)

export default userLicense;
