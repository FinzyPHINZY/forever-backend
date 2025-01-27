import { v2 as cloudinary } from 'cloudinary';

const connectCloudinary = async () => {
  cloudinary.config(process.env.CLOUDINARY_URL);

  console.log('cloudinary connected');
};

export default connectCloudinary;
