import express from 'express';
import * as OrderController from '../controllers/order.js';
import { adminAuth } from '../middlewares/adminAuth.js';
import { userExtractor } from '../middlewares/auth.js';

const router = express.Router();

// get all orders
router.get('/orders', adminAuth, OrderController.getOrders);

// user orders
router.get('/user/orders', userExtractor, OrderController.userOrders);

// update status
router.post('/update', adminAuth, OrderController.updateStatus);

// cash on delivery - place order
router.post('/place', userExtractor, OrderController.placeOrder);

// stripe - place order
router.post('/stripe', userExtractor, OrderController.placeOrderStripe);

// verify payment
router.post('/verify-stripe', userExtractor, OrderController.verifyStripe);

export default router;
