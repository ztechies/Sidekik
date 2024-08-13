import express, { Router } from 'express';
import { addProfile, updateProfile, getAllProfiles, deleteProfile, getProfileById, getProfileByUserId } from '../controllers/profile.controller';
import validate from '../middleware/validate';
import { addProfileSchema, updateProfileSchema } from '../validation/profile';
import { verifyToken } from '../middleware/verifyToken';

const profileRouter: Router = express.Router();

profileRouter.get('/', getAllProfiles)
profileRouter.get('/:id', getProfileById)
profileRouter.get('/userId/:userId', getProfileByUserId)
profileRouter.post('/', validate(addProfileSchema), addProfile)
profileRouter.patch('/:userId', validate(updateProfileSchema), updateProfile)
profileRouter.delete('/:id', deleteProfile)

export default profileRouter;