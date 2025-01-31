import validator from 'validator';
import bcrypt from 'bcrypt';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import { createToken } from '../lib/utils.js';

// register user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res
        .status(401)
        .json({ success: false, message: 'User already exists' });
    }

    // validate email
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid Credentials' });
    }

    // validate password
    if (password.length < 8) {
      return res
        .status(400)
        .json({ success: false, message: 'Please, enter a strong password' });
    }

    // hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // create user document
    const newUser = await new User({
      name,
      email,
      password: passwordHash,
    });

    // save user document
    const user = await newUser.save();

    // generate token
    const token = createToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Registration successful',
      token,
    });
  } catch (error) {
    console.error('user registration failed: ', error.message);

    return res
      .status(500)
      .json({ success: false, message: 'Internal Server Error' });
  }
};

// login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ success: false, message: 'Incorrect password' });
    }

    const token = createToken(user);
    return res
      .status(201)
      .json({ success: true, message: 'User signed in successfully', token });
  } catch (error) {
    console.error('user login failed: ', error.message);

    return res
      .status(500)
      .json({ success: false, message: 'Internal Server Error' });
  }
};

// admin login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const tokenData = {
      email,
      password,
    };
    const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    return res
      .status(200)
      .json({ success: true, message: 'Welcome admin', token });
  } catch (error) {
    console.error('admin login failed: ', error.message);

    return res
      .status(500)
      .json({ success: false, message: 'Internal Server Error' });
  }
};
