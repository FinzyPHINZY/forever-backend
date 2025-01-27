import express from 'express';
import * as userController from '../controllers/user.js';

const router = express.Router();

// register user
router.post('/register', userController.registerUser);

// login user
router.post('/login', userController.login);

// login admin
router.post('/admin', userController.adminLogin);

export default router;
