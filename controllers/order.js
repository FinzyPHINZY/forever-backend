import Order from '../models/order.js';
import User from '../models/user.js';

export const placeOrder = async (req, res) => {
  try {
    const { items, amount, address } = req.body;

    const orderData = {
      userId: req.user.id,
      items,
      amount,
      address,
      paymentMethod: 'COD',
      payment: false,
      date: Date.now(),
    };

    const newOrder = new Order(orderData);

    await newOrder.save();

    // clear user cart
    await User.findByIdAndUpdate(req.user.id, { cartData: {} });

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const placeOrderStripe = async (req, res) => {
  try {
  } catch (error) {}
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({});

    return res
      .status(201)
      .json({ success: true, message: 'Orders fetched successfully', orders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const userOrders = async (req, res) => {
  try {
    const { id } = req.user;

    const orders = await Order.find({ userId: id });
    if (!orders) {
      return res
        .status(404)
        .json({ success: false, message: 'Orders not found' });
    }

    res
      .status(201)
      .json({ success: true, message: 'Fetched orders successfully', orders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    await Order.findByIdAndUpdate(orderId, { status });

    return res.status(201).json({ success: true, message: 'Status updated' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
