import express, { Router } from 'express';
import { getAllUserPortfolios, getUserPortfolioById, addUserPortfolio, updateUserPortfolio, deleteUserPortfolio, getPortfolioByProfileId } from '../controllers/userPortfolio.controller';
import { validate } from '../middleware/validator';
import { verifyToken } from '../middleware/verifyToken';
import { updateUserPortfolioSchema, addUserPortfolioSchema } from '../validation/userPortfolio';
import { isUser } from '../middleware/isUser';

const userPortfolio: Router = express.Router();

userPortfolio.get('/', verifyToken, getAllUserPortfolios)
userPortfolio.get('/profile-id/:profileId', getPortfolioByProfileId)
userPortfolio.get('/:id', verifyToken, getUserPortfolioById)
userPortfolio.post('/', validate(addUserPortfolioSchema), addUserPortfolio)
userPortfolio.patch('/', validate(updateUserPortfolioSchema), updateUserPortfolio)
userPortfolio.delete('/:id', verifyToken, deleteUserPortfolio)

export default userPortfolio;
