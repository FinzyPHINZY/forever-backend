import User from '../models/user.js';

export const addToCart = async (req, res) => {
  try {
    const { itemId, size } = req.body;

    const user = await User.findById(req.user._id);
    const cartData = await user.cartData;

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size]++;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    await User.findByIdAndUpdate(req.user._id, { cartData });

    return res
      .status(201)
      .json({ success: true, message: 'Added to cart successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCart = async (req, res) => {
  try {
    const { itemId, size, quantity } = req.body;

    const user = await User.findById(req.user._id);
    const cartData = await user.cartData;

    cartData[itemId][size] = quantity;

    await User.findByIdAndUpdate(req.user._id, { cartData });

    return res.status(201).json({ success: true, message: 'Cart updated' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const cartData = await user.cartData;

    return res.status(201).json({ success: true, cartData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
