import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(
      'Success🚀: Connected to MongoDB successfully',
      conn.connection.host
    );
  } catch (error) {
    console.log('FAILED⛔: MongoDB Connection is unsuccessful');
    process.exit(1);
  }
};

export default connectDB;
