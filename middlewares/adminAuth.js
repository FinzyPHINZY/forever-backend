import jwt from 'jsonwebtoken';

export const adminAuth = async (req, res, next) => {
  try {
    const token = req.token;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: 'Token is not provided' });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (
      decodedToken.email !== process.env.ADMIN_EMAIL ||
      decodedToken.password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    next();
  } catch (error) {
    console.log('Admin auth failed', error.message);
    return res
      .status(500)
      .json({ success: false, message: 'Internal Server Error' });
  }
};
