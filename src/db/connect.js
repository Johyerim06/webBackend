import mongoose from 'mongoose';
import { config } from '../config/env.js';

export async function connectDB(){
  await mongoose.connect(config.MONGODB_URI);
  console.log('[DB] connected');
}
