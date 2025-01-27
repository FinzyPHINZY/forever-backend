import jwt from 'jsonwebtoken';

export const createToken = (user) => {
  const payload = {
    id: user._id.toString(),
    email: user.email,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1d', // expires in 1 Day
  });
};
