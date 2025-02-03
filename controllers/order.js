import Stripe from 'stripe';
import Order from '../models/order.js';
import User from '../models/user.js';
import { config } from 'dotenv';

config();

const currency = 'ngn';
const deliveryCharges = 1500;

//  initialize gateway
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const placeOrder = async (req, res) => {
  try {
    const { items, amount, address } = req.body;

    console.log(req.user);

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
    const { id } = req.user;
    const { items, amount, address } = req.body;
    const { origin } = req.headers;

    const orderData = {
      userId: id,
      items,
      address,
      amount,
      paymentMethod: 'Stripe',
      payment: false,
      date: Date.now(),
    };

    const newOrder = new Order(orderData);
    await newOrder.save();

    const line_items = items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 10000,
      },
      quantity: item.quantity,
    }));

    console.log(line_items);

    line_items.push({
      price_data: {
        currency: currency,
        product_data: {
          name: 'Delivery Charges',
        },
        unit_amount: deliveryCharges * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: 'payment',
    });

    res.status(200).json({ success: true, session: session.url });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyStripe = async (req, res) => {
  const { orderId, success } = req.body;

  try {
    if (success) {
      await Order.findByIdAndUpdate(orderId, { payment: true });
      await User.findByIdAndUpdate(req.user.id, { cartData: {} });

      return res
        .status(201)
        .json({ success: true, message: 'Payment verified successfully' });
    } else {
      await Order.findByIdAndDelete(orderId);

      return res
        .status(400)
        .json({ success: false, message: 'Payment failed' });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
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
