import { v2 as cloudinary } from 'cloudinary';
import Product from '../models/product.js';

// add product
export const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
    } = req.body;

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter((img) => img);

    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_secret: process.env.CLOUDINARY_API_SECRET,
          api_key: process.env.CLOUDINARY_API_KEY,
          resource_type: 'image',
        });

        return result.secure_url;
      })
    );

    const productData = {
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      sizes: JSON.parse(sizes),
      bestseller: Boolean(bestseller),
      images: imagesUrl,
      date: Date.now(),
    };

    const product = new Product(productData);

    await product.save();

    return res
      .status(200)
      .json({ success: true, message: 'Product added successfully' });
  } catch (error) {
    console.error('Failed to fetch product', error);

    return res
      .status(500)
      .json({ success: false, message: 'Internal Server Error' });
  }
};

// get products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});

    return res
      .status(200)
      .json({
        success: true,
        message: 'Fetched products successfully',
        data: products,
      });
  } catch (error) {
    console.error('Failed to fetch products', error);

    return res
      .status(500)
      .json({ success: false, message: 'Internal Server Error' });
  }
};

// remove product
export const removeProduct = async (req, res) => {
  try {
  } catch (error) {
    console.error('Failed to remove product', error);

    return res
      .status(500)
      .json({ success: false, message: 'Internal Server Error' });
  }
};

// get product
export const getProduct = async (req, res) => {
  try {
  } catch (error) {
    console.error('Failed to fetch product', error);

    return res
      .status(500)
      .json({ success: false, message: 'Internal Server Error' });
  }
};
