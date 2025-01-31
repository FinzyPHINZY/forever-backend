import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from 'dotenv';
import { requestLogger } from './middlewares/log/middleware.js';
import connectDB from './config/database.js';
import connectCloudinary from './config/cloudinary.js';
import userRoutes from './routes/user.js';
import productRoutes from './routes/product.js';
import cartRoutes from './routes/cart.js';
import { tokenExtractor } from './lib/utils.js';
import { userExtractor } from './middlewares/auth.js';

// app config
config();
const app = express();
const PORT = process.env.PORT || 7000;

// connect to db
connectDB();

// connect to cloudinary
connectCloudinary();

// middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(requestLogger);
app.use(tokenExtractor);
app.use(tokenExtractor);
app.use(userExtractor);

// api endpoints
app.get('/', (req, res) => {
  return res.json({
    success: true,
    status: 'ok',
    message: 'Welcome to Forever',
  });
});

app.use('/api/user', userRoutes);
app.use('/api/product', productRoutes);
app.use('/api/cart', cartRoutes);

app.listen(PORT, () => {
  console.log(
    `Server is running on http://localhost:${PORT} ... betta go catch it`
  );
});
