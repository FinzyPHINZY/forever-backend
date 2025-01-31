import express from 'express';
import * as CartController from '../controllers/cart.js';
import { authUser, userExtractor } from '../middlewares/auth.js';
const router = express.Router();

router.use(userExtractor);
router.use(authUser);

router.get('/get', CartController.getUserCart);
router.post('/add', CartController.addToCart);
router.post('/update', CartController.updateCart);

export default router;
