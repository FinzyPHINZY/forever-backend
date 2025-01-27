import express from 'express';
import cors from 'cors';
import logger from 'morgan';
import helmet from 'helmet';
import 'dotenv/config';
import { requestLogger } from './middlewares/util.js';
import connectDB from './config/database.js';
import connectCloudinary from './config/cloudinary.js';

// app config
const app = express();
const PORT = process.env.PORT || 7000;

// connect to db
connectDB();

// connect to cloudinary
connectCloudinary();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(requestLogger);

app.get('/', (req, res) => {
  return res.json({
    success: true,
    status: 'ok',
    message: 'Welcome to Forever',
  });
});

app.listen(PORT, () => {
  console.log(
    `Server is running on http://localhost:${PORT} ... betta go catch it`
  );
});
