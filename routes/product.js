import express from 'express';
import * as productController from '../controllers/product.js';
import upload from '../middlewares/multer.js';
import { adminAuth } from '../middlewares/adminAuth.js';

const router = express.Router();

// add product
router.post(
  '/add',
  adminAuth,
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 },
  ]),
  productController.addProduct
);

// remove product
router.delete('/remove/:id', adminAuth, productController.removeProduct);

// get products
router.get('/products', productController.getProducts);

// get product
router.get('/products/:id', productController.getProduct);

export default router;
