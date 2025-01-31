import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization');

  if (authorization && authorization.startsWith('Bearer ')) {
    req.token = authorization.replace('Bearer ', '');
  } else {
    req.token = null;
  }

  next();
};

export const userExtractor = async (req, res, next) => {
  const decodedToken = jwt.verify(req.token, process.env.JWT_SECRET);

  if (!decodedToken.id) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }

  const user = await User.findById({ _id: decodedToken.id });

  if (user) {
    req.user = { user, ...decodedToken };
  } else {
    req.user = null;
  }

  next();
};

export const authUser = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  next();
};
