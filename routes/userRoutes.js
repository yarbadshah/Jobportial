import express from 'express';
import userAuth from '../middlewares/authMiddlewares.js';
import { updataUserController } from './../controllers/userController.js';

const router = express.Router()

router.put('/update-user', userAuth, updataUserController)

export default router