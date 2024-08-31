import express, { Router } from 'express';
import { getFile, uploadFile } from '../controllers/file.controller';
import upload from '../utils/upload';
import { verifyToken } from '../middleware/verifyToken';

const FileRouter: Router = express.Router();

// FileRouter.post('/upload', verifyToken, upload.single("file"), uploadFile);
// FileRouter.get('/:filename', verifyToken, getFile);

export default FileRouter;
