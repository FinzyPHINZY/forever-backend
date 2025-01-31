import express from 'express';
import * as CartController from '../controllers/cart';
import { authUser } from '../middlewares/auth';
const router = express.Router();

router.use(authUser);

router.get('/get', CartController.getUserCart);
router.post('/add', CartController.addToCart);
router.post('/update', CartController.updateCart);

export default router;
