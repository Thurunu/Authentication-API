import express from 'express';
import { Login, logout, register } from '../controllers/authController.js';


const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', Login);
authRouter.post('/logout', logout);

export default authRouter;