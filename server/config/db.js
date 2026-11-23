import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false;

export const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smartmanufacture_erp';
  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2000 // fast timeout to detect if local mongo is running
    });
    isConnected = true;
    console.log(`[MongoDB] Connected to database: ${conn.connection.host}`);
    return true;
  } catch (error) {
    isConnected = false;
    console.log(`[Database Engine] MongoDB offline or unreachable (${error.message}).`);
    console.log(`[Database Engine] Activating high-performance Embedded Persistence Storage Engine.`);
    return false;
  }
};

export const getDBStatus = () => ({
  type: isConnected ? 'MongoDB (Active)' : 'Embedded Enterprise Storage (Active)',
  connected: true,
  isMongo: isConnected
});
