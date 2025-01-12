import express from 'express';
import { isAuthenticated, Login, logout, register, resetPassword, sendRestOtp, sendVerifyOtp, verifyEmail } from '../controllers/authController.js';
import userAuth from '../middleware/userAuth.js';

const authRouter = express.Router();

// Route to handle user registration
authRouter.post('/register', register);

// Route to handle user login
authRouter.post('/login', Login);

// Route to handle user logout
authRouter.post('/logout', logout);

// Route to send verification OTP (requires user to be authenticated)
authRouter.post('/send-verify-otp', userAuth, sendVerifyOtp);

// Route to verify user account using OTP (requires user to be authenticated)
authRouter.post('/verify-account', userAuth, verifyEmail);

authRouter.post('/is-auth', userAuth, isAuthenticated);

authRouter.post('/send-reset-otp', sendRestOtp);
authRouter.post('/reset', resetPassword);
export default authRouter;
